-- =============================================================================
-- Migration: 001_create_credit_limit_increase_schema.sql
-- Feature:   Credit Limit Increase Request
-- Author:    Meridian Bank — Core Banking Engineering
-- Date:      2026-06-10
-- DB Target: PostgreSQL 15+
--
-- Execution order:
--   1. CREDIT_POLICY_CONFIG              (no FKs — seed data required before app starts)
--   2. BUREAU_PULL_LOG                   (FK to CUSTOMERS — must exist)
--   3. CREDIT_LIMIT_INCREASE_REQUEST     (FK to CUSTOMERS, CARDS)
--   4. CREDIT_LIMIT_REQUEST_AUDIT        (FK to CREDIT_LIMIT_INCREASE_REQUEST)
--   5. OTP_SESSIONS                      (FK to CREDIT_LIMIT_INCREASE_REQUEST, CUSTOMERS)
--   6. TRUSTED_DEVICES                   (FK to CUSTOMERS — fraud signal store)
--   7. Indexes
--   8. Triggers (SOX audit trail)
--   9. Grants
--  10. Seed data
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Extension prerequisites
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_bytes(), crypt()

-- ---------------------------------------------------------------------------
-- 1. CREDIT_POLICY_CONFIG
--    Stores all configurable bank policy thresholds.
--    No hardcoded constants in application code — all values read from here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_policy_config (
    config_key          VARCHAR(100)    NOT NULL,
    config_value        VARCHAR(255)    NOT NULL,
    data_type           VARCHAR(20)     NOT NULL    CHECK (data_type IN ('NUMBER','STRING','BOOLEAN','DATE')),
    description         VARCHAR(500)    NOT NULL,
    effective_from      DATE            NOT NULL,
    effective_to        DATE            NULL,                  -- NULL = active indefinitely
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    updated_by          VARCHAR(50)     NOT NULL,
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_credit_policy_config PRIMARY KEY (config_key),
    CONSTRAINT chk_policy_effective_dates CHECK (effective_to IS NULL OR effective_to > effective_from)
);

COMMENT ON TABLE  credit_policy_config                  IS 'Bank policy configuration for credit limit increase rules. All thresholds read from here — never hardcoded.';
COMMENT ON COLUMN credit_policy_config.config_key       IS 'Unique policy rule identifier (e.g. MIN_INCREASE_AMOUNT)';
COMMENT ON COLUMN credit_policy_config.config_value     IS 'Scalar value for the rule; interpret using data_type';
COMMENT ON COLUMN credit_policy_config.effective_to     IS 'NULL means indefinitely active';

-- ---------------------------------------------------------------------------
-- 2. BUREAU_PULL_LOG
--    Records every credit bureau enquiry for regulatory compliance.
--    Bureau pulls are expensive and regulated — cached for BUREAU_CACHE_TTL_HOURS.
--    Prerequisite: CUSTOMERS table must exist (FK defined below as ALTER).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bureau_pull_log (
    pull_id                     UUID            NOT NULL DEFAULT uuid_generate_v4(),
    customer_id                 VARCHAR(50)     NOT NULL,
    bureau_provider             VARCHAR(50)     NOT NULL    CHECK (bureau_provider IN ('CIBIL','EQUIFAX','EXPERIAN','HIGHMARK')),
    credit_score                SMALLINT        NOT NULL    CHECK (credit_score BETWEEN 300 AND 900),
    score_band                  VARCHAR(20)     NOT NULL    CHECK (score_band IN ('EXCELLENT','GOOD','FAIR','POOR','NO_HISTORY')),
    raw_response_encrypted      TEXT            NULL,       -- AES-256-GCM encrypted full bureau response
    pulled_at                   TIMESTAMPTZ     NOT NULL    DEFAULT NOW(),
    cache_expires_at            TIMESTAMPTZ     NOT NULL,   -- pulled_at + BUREAU_CACHE_TTL_HOURS
    triggered_by_request_id     VARCHAR(30)     NULL,       -- which CLR request triggered this pull
    bureau_enquiry_ref          VARCHAR(100)    NULL,       -- bureau's own reference number
    http_status_code            SMALLINT        NULL,       -- HTTP response code from bureau API
    created_at                  TIMESTAMPTZ     NOT NULL    DEFAULT NOW(),

    CONSTRAINT pk_bureau_pull_log        PRIMARY KEY (pull_id),
    CONSTRAINT chk_bureau_cache_expiry   CHECK (cache_expires_at > pulled_at)
);

COMMENT ON TABLE  bureau_pull_log                           IS 'Audit log of all credit bureau enquiries. Retained 7 years per regulatory requirement.';
COMMENT ON COLUMN bureau_pull_log.raw_response_encrypted    IS 'Full bureau response body, AES-256-GCM encrypted. Decryption key managed by KMS.';
COMMENT ON COLUMN bureau_pull_log.cache_expires_at          IS 'Computed as pulled_at + config value BUREAU_CACHE_TTL_HOURS. Reuse this pull if still valid.';

-- ---------------------------------------------------------------------------
-- 3. CREDIT_LIMIT_INCREASE_REQUEST
--    Primary request record. One row per submitted request.
--    Status transitions:
--      PENDING → PENDING_OTP → PENDING (OTP verified)
--      PENDING → APPROVED
--      PENDING → REJECTED
--      PENDING → CANCELLED (customer withdrawal)
--      PENDING → EXPIRED   (no decision within expiry window)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_limit_increase_request (
    -- Identity
    request_id                  VARCHAR(30)     NOT NULL,   -- Format: CLR-YYYY-NNNN
    customer_id                 VARCHAR(50)     NOT NULL,
    card_id                     VARCHAR(50)     NOT NULL,

    -- Card snapshot (PAN never stored; token only)
    card_number_masked          VARCHAR(19)     NOT NULL,   -- XXXX XXXX XXXX 1234
    card_number_token           VARCHAR(200)    NOT NULL,   -- Tokenised PAN from vault
    card_brand                  VARCHAR(20)     NULL,       -- VISA, MASTERCARD, AMEX

    -- Request amounts
    current_limit               DECIMAL(15,2)   NOT NULL    CHECK (current_limit > 0),
    requested_increase          DECIMAL(15,2)   NOT NULL    CHECK (requested_increase > 0),
    proposed_new_limit          DECIMAL(15,2)   NOT NULL    CHECK (proposed_new_limit > current_limit),
    request_reason              VARCHAR(50)     NOT NULL    CHECK (request_reason IN (
                                                                'BUSINESS_EXPANSION','LIFESTYLE_UPGRADE',
                                                                'EMERGENCY','TRAVEL','MEDICAL','EDUCATION','OTHER')),
    currency_code               CHAR(3)         NOT NULL DEFAULT 'INR',

    -- AC7: Credit eligibility snapshot at time of request
    credit_score_at_request     SMALLINT        NULL        CHECK (credit_score_at_request BETWEEN 300 AND 900),
    score_band_at_request       VARCHAR(20)     NULL,
    utilization_at_request      DECIMAL(5,2)    NULL        CHECK (utilization_at_request BETWEEN 0 AND 100),
    bureau_pull_id              UUID            NULL,       -- FK to bureau_pull_log

    -- AC9: KYC snapshot
    kyc_status_at_request       VARCHAR(20)     NOT NULL    CHECK (kyc_status_at_request IN ('VERIFIED','PENDING','EXPIRED','REJECTED')),
    kyc_expiry_at_request       DATE            NULL,

    -- AC8: Fraud assessment
    fraud_risk_score            SMALLINT        NULL        CHECK (fraud_risk_score BETWEEN 0 AND 100),
    fraud_risk_level            VARCHAR(10)     NULL        CHECK (fraud_risk_level IN ('LOW','MEDIUM','HIGH')),
    fraud_assessment_id         VARCHAR(100)    NULL,       -- Reference ID from fraud engine
    otp_required                BOOLEAN         NOT NULL DEFAULT FALSE,
    otp_verified                BOOLEAN         NOT NULL DEFAULT FALSE,
    otp_session_id              UUID            NULL,

    -- AC10: Compliance
    aml_status                  VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                                                    CHECK (aml_status IN ('CLEAR','FLAGGED','BLOCKED','PENDING')),
    sanctions_match             BOOLEAN         NOT NULL DEFAULT FALSE,
    compliance_check_id         VARCHAR(100)    NULL,

    -- Request lifecycle
    request_status              VARCHAR(30)     NOT NULL DEFAULT 'PENDING'
                                                    CHECK (request_status IN (
                                                        'PENDING','PENDING_OTP','APPROVED',
                                                        'REJECTED','CANCELLED','EXPIRED')),
    rejection_code              VARCHAR(60)     NULL,
    rejection_reason            TEXT            NULL,
    approved_new_limit          DECIMAL(15,2)   NULL,       -- May differ from proposed (partial approval)

    -- Timestamps (all server-generated; never client-supplied)
    request_timestamp           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),   -- AC5: authoritative submission time
    approval_timestamp          TIMESTAMPTZ     NULL,
    rejection_timestamp         TIMESTAMPTZ     NULL,
    expiry_timestamp            TIMESTAMPTZ     NULL,       -- Auto-expire if no decision by this time

    -- Request context (fraud/audit signals)
    ip_address                  VARCHAR(45)     NOT NULL,   -- IPv4 or IPv6
    device_fingerprint_hash     VARCHAR(255)    NULL,       -- SHA-256 of device fingerprint
    user_agent                  VARCHAR(500)    NULL,
    session_id                  VARCHAR(100)    NOT NULL,
    geo_country_code            CHAR(2)         NULL,       -- ISO 3166-1 alpha-2
    geo_city                    VARCHAR(100)    NULL,

    -- Audit housekeeping
    created_by                  VARCHAR(50)     NOT NULL,   -- = customer_id for self-service
    updated_by                  VARCHAR(50)     NOT NULL,
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    version                     INTEGER         NOT NULL DEFAULT 1,  -- optimistic locking

    -- Constraints
    CONSTRAINT pk_credit_limit_increase_request     PRIMARY KEY (request_id),
    CONSTRAINT chk_clir_proposed_limit              CHECK (proposed_new_limit = current_limit + requested_increase),
    CONSTRAINT chk_clir_approval_timestamp          CHECK (approval_timestamp IS NULL OR approval_timestamp >= request_timestamp),
    CONSTRAINT chk_clir_rejection_timestamp         CHECK (rejection_timestamp IS NULL OR rejection_timestamp >= request_timestamp),
    CONSTRAINT chk_clir_approved_limit              CHECK (approved_new_limit IS NULL OR approved_new_limit > current_limit),
    CONSTRAINT chk_clir_otp_consistency             CHECK (
        (otp_required = FALSE AND otp_verified = FALSE) OR
        (otp_required = TRUE)
    )
);

COMMENT ON TABLE  credit_limit_increase_request                         IS 'Primary table for credit limit increase requests. One row per request submission.';
COMMENT ON COLUMN credit_limit_increase_request.request_id              IS 'Business key. Format: CLR-YYYY-NNNN. Generated by application sequence.';
COMMENT ON COLUMN credit_limit_increase_request.card_number_token       IS 'Tokenised PAN from vault (e.g. HashiCorp Vault, AWS Payment Cryptography). Full PAN never stored here.';
COMMENT ON COLUMN credit_limit_increase_request.request_timestamp       IS 'AC5: Server-generated UTC timestamp. Never accept client-supplied value.';
COMMENT ON COLUMN credit_limit_increase_request.device_fingerprint_hash IS 'SHA-256 hash of device fingerprint. Raw fingerprint never stored.';
COMMENT ON COLUMN credit_limit_increase_request.version                 IS 'Optimistic locking version. Increment on every UPDATE to prevent lost updates under concurrency.';

-- ---------------------------------------------------------------------------
-- 4. CREDIT_LIMIT_REQUEST_AUDIT
--    Immutable, append-only SOX audit trail.
--    NO UPDATE or DELETE grants on this table at the application DB user level.
--    Every state change, validation result, and user action is recorded here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_limit_request_audit (
    audit_id                BIGSERIAL       NOT NULL,
    request_id              VARCHAR(30)     NOT NULL,       -- FK to credit_limit_increase_request

    event_type              VARCHAR(60)     NOT NULL        CHECK (event_type IN (
                                                                -- AC1
                                                                'CARD_VALIDATION_ATTEMPTED',
                                                                'CARD_VALIDATION_PASSED',
                                                                'CARD_VALIDATION_FAILED',
                                                                -- AC2
                                                                'CREDIT_LIMIT_RETRIEVED',
                                                                'CREDIT_LIMIT_RETRIEVAL_FAILED',
                                                                -- AC3
                                                                'AMOUNT_VALIDATION_PASSED',
                                                                'AMOUNT_VALIDATION_FAILED',
                                                                -- AC4
                                                                'CUSTOMER_IDENTITY_VERIFIED',
                                                                'CUSTOMER_IDENTITY_FAILED',
                                                                -- AC5
                                                                'REQUEST_SUBMITTED',
                                                                -- AC6
                                                                'ACCOUNT_STATUS_CHECKED',
                                                                'CARD_STATUS_CHECKED',
                                                                'STATUS_CHECK_FAILED',
                                                                -- AC7
                                                                'CREDIT_SCORE_RETRIEVED',
                                                                'CREDIT_SCORE_FAILED',
                                                                'ELIGIBILITY_PASSED',
                                                                'ELIGIBILITY_FAILED',
                                                                -- AC8
                                                                'FRAUD_ASSESSMENT_COMPLETED',
                                                                'FRAUD_HIGH_RISK_BLOCKED',
                                                                'OTP_TRIGGERED',
                                                                'OTP_SENT',
                                                                'OTP_VERIFIED',
                                                                'OTP_VERIFICATION_FAILED',
                                                                'OTP_EXPIRED',
                                                                'OTP_LOCKED',
                                                                -- AC9
                                                                'KYC_VALIDATION_PASSED',
                                                                'KYC_VALIDATION_FAILED',
                                                                -- AC10
                                                                'AML_SCREENING_PASSED',
                                                                'AML_SCREENING_FLAGGED',
                                                                'COMPLIANCE_CHECK_PASSED',
                                                                'COMPLIANCE_CHECK_FAILED',
                                                                -- Lifecycle
                                                                'REQUEST_APPROVED',
                                                                'REQUEST_REJECTED',
                                                                'REQUEST_CANCELLED',
                                                                'REQUEST_EXPIRED'
                                                            )),
    from_status             VARCHAR(30)     NULL,           -- status before the event
    to_status               VARCHAR(30)     NULL,           -- status after the event
    event_detail            JSONB           NULL,           -- AC-specific detail (score, risk level, etc.)
    failure_code            VARCHAR(60)     NULL,           -- machine-readable failure code
    failure_message         TEXT            NULL,           -- human-readable failure reason

    -- Who / what triggered this event
    actor_id                VARCHAR(50)     NOT NULL,       -- customer_id or service name
    actor_type              VARCHAR(20)     NOT NULL        CHECK (actor_type IN ('CUSTOMER','SYSTEM','OFFICER','FRAUD_ENGINE','COMPLIANCE_ENGINE')),

    -- Context at event time
    ip_address              VARCHAR(45)     NULL,
    device_fingerprint_hash VARCHAR(255)    NULL,
    session_id              VARCHAR(100)    NULL,

    event_timestamp         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_credit_limit_request_audit    PRIMARY KEY (audit_id),
    CONSTRAINT fk_clra_request_id               FOREIGN KEY (request_id)
                                                    REFERENCES credit_limit_increase_request(request_id)
                                                    ON DELETE RESTRICT      -- audit records must outlive the request
);

COMMENT ON TABLE  credit_limit_request_audit                    IS 'SOX-compliant immutable audit trail. INSERT only — no UPDATE or DELETE permitted at application layer.';
COMMENT ON COLUMN credit_limit_request_audit.event_detail       IS 'JSONB payload with AC-specific data. E.g. for CREDIT_SCORE_RETRIEVED: {"score":720,"band":"GOOD","bureau":"CIBIL","pull_id":"uuid"}';
COMMENT ON COLUMN credit_limit_request_audit.actor_type         IS 'SYSTEM for automated checks; CUSTOMER for user-initiated actions; OFFICER for back-office decisions.';

-- ---------------------------------------------------------------------------
-- 5. OTP_SESSIONS
--    Manages OTP lifecycle for medium-risk (AC8) requests.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp_sessions (
    otp_session_id          UUID            NOT NULL DEFAULT uuid_generate_v4(),
    request_id              VARCHAR(30)     NOT NULL,
    customer_id             VARCHAR(50)     NOT NULL,
    mobile_last4            CHAR(4)         NOT NULL,       -- for masked display only
    otp_hash                VARCHAR(255)    NOT NULL,       -- bcrypt hash of OTP — never store plaintext
    expires_at              TIMESTAMPTZ     NOT NULL,       -- NOW() + 5 minutes
    verified_at             TIMESTAMPTZ     NULL,           -- set on successful verification
    attempts_used           SMALLINT        NOT NULL DEFAULT 0,
    max_attempts            SMALLINT        NOT NULL DEFAULT 3,
    locked_until            TIMESTAMPTZ     NULL,           -- set after max_attempts exceeded
    delivery_channel        VARCHAR(20)     NOT NULL DEFAULT 'SMS'
                                                CHECK (delivery_channel IN ('SMS','EMAIL','VOICE')),
    delivery_status         VARCHAR(20)     NOT NULL DEFAULT 'SENT'
                                                CHECK (delivery_status IN ('SENT','DELIVERED','FAILED')),
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_otp_sessions          PRIMARY KEY (otp_session_id),
    CONSTRAINT fk_otp_request_id        FOREIGN KEY (request_id)
                                            REFERENCES credit_limit_increase_request(request_id)
                                            ON DELETE CASCADE,
    CONSTRAINT chk_otp_expiry           CHECK (expires_at > created_at),
    CONSTRAINT chk_otp_attempts         CHECK (attempts_used <= max_attempts),
    CONSTRAINT chk_otp_locked_until     CHECK (locked_until IS NULL OR locked_until > created_at)
);

COMMENT ON TABLE  otp_sessions                  IS 'OTP session state for medium-risk fraud assessments (AC8). OTP values stored as bcrypt hashes only.';
COMMENT ON COLUMN otp_sessions.otp_hash         IS 'bcrypt(otp_code, cost=12). The raw OTP is never stored. Comparison done via crypt(input, otp_hash).';
COMMENT ON COLUMN otp_sessions.locked_until     IS 'Set when attempts_used reaches max_attempts. Application must reject all attempts until NOW() > locked_until.';

-- ---------------------------------------------------------------------------
-- 6. TRUSTED_DEVICES
--    Stores device fingerprint hashes linked to customers.
--    Used by FraudAssessmentService to distinguish known vs. unknown devices.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trusted_devices (
    device_id               UUID            NOT NULL DEFAULT uuid_generate_v4(),
    customer_id             VARCHAR(50)     NOT NULL,
    device_fingerprint_hash VARCHAR(255)    NOT NULL,   -- SHA-256 of device fingerprint
    device_name             VARCHAR(200)    NULL,       -- user-assigned label (optional)
    os_platform             VARCHAR(50)     NULL,       -- e.g. Windows 11, iOS 17.4
    browser                 VARCHAR(100)    NULL,       -- e.g. Chrome 124
    first_seen_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    last_seen_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    trusted_since           TIMESTAMPTZ     NULL,       -- NULL = not yet trusted
    is_trusted              BOOLEAN         NOT NULL DEFAULT FALSE,
    revoked_at              TIMESTAMPTZ     NULL,       -- set if customer revokes trust
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_trusted_devices       PRIMARY KEY (device_id),
    CONSTRAINT uq_trusted_device        UNIQUE (customer_id, device_fingerprint_hash)
);

COMMENT ON TABLE trusted_devices IS 'Customer trusted device registry. Used by fraud engine to score unknown device signal.';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- credit_limit_increase_request
CREATE INDEX idx_clir_customer_id
    ON credit_limit_increase_request (customer_id);

CREATE INDEX idx_clir_card_id
    ON credit_limit_increase_request (card_id);

CREATE INDEX idx_clir_status
    ON credit_limit_increase_request (request_status);

CREATE INDEX idx_clir_request_timestamp
    ON credit_limit_increase_request (request_timestamp DESC);

-- Composite: fetch all requests for a customer in a specific status quickly
CREATE INDEX idx_clir_customer_status
    ON credit_limit_increase_request (customer_id, request_status);

-- Composite: detect duplicate active requests per card (supports UNIQUE constraint)
-- Only one PENDING or PENDING_OTP request per card is allowed at any time
CREATE UNIQUE INDEX idx_clir_no_duplicate_active
    ON credit_limit_increase_request (card_id, request_status)
    WHERE request_status IN ('PENDING', 'PENDING_OTP');

-- credit_limit_request_audit
CREATE INDEX idx_clra_request_id
    ON credit_limit_request_audit (request_id);

CREATE INDEX idx_clra_event_timestamp
    ON credit_limit_request_audit (event_timestamp DESC);

CREATE INDEX idx_clra_event_type
    ON credit_limit_request_audit (event_type);

CREATE INDEX idx_clra_actor_id
    ON credit_limit_request_audit (actor_id);

-- Composite: compliance queries — all events for a customer across all requests
CREATE INDEX idx_clra_customer_events
    ON credit_limit_request_audit (actor_id, event_type, event_timestamp DESC)
    WHERE actor_type = 'CUSTOMER';

-- bureau_pull_log
CREATE INDEX idx_bpl_customer_id
    ON bureau_pull_log (customer_id);

CREATE INDEX idx_bpl_cache_expiry
    ON bureau_pull_log (customer_id, cache_expires_at DESC);

-- otp_sessions
CREATE INDEX idx_otp_request_id
    ON otp_sessions (request_id);

CREATE INDEX idx_otp_customer_id
    ON otp_sessions (customer_id);

-- trusted_devices
CREATE INDEX idx_td_customer_id
    ON trusted_devices (customer_id);

CREATE INDEX idx_td_fingerprint
    ON trusted_devices (device_fingerprint_hash);

-- credit_policy_config
CREATE INDEX idx_cpc_active
    ON credit_policy_config (config_key, is_active)
    WHERE is_active = TRUE;

-- =============================================================================
-- TRIGGERS — SOX Audit Trail (immutable, database-level)
-- =============================================================================

-- Function: capture every INSERT and UPDATE on the request table into the audit log
CREATE OR REPLACE FUNCTION fn_clir_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER   -- runs as table owner, not caller — prevents privilege bypass
AS $$
DECLARE
    v_event_type    VARCHAR(60);
    v_from_status   VARCHAR(30);
    v_to_status     VARCHAR(30);
    v_detail        JSONB;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        v_event_type  := 'REQUEST_SUBMITTED';
        v_from_status := NULL;
        v_to_status   := NEW.request_status;
        v_detail      := jsonb_build_object(
            'current_limit',        NEW.current_limit,
            'requested_increase',   NEW.requested_increase,
            'proposed_new_limit',   NEW.proposed_new_limit,
            'request_reason',       NEW.request_reason,
            'kyc_status',           NEW.kyc_status_at_request
        );
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Detect which status transition triggered this update
        IF OLD.request_status <> NEW.request_status THEN
            v_from_status := OLD.request_status;
            v_to_status   := NEW.request_status;
            v_event_type  := CASE NEW.request_status
                                WHEN 'APPROVED'   THEN 'REQUEST_APPROVED'
                                WHEN 'REJECTED'   THEN 'REQUEST_REJECTED'
                                WHEN 'CANCELLED'  THEN 'REQUEST_CANCELLED'
                                WHEN 'EXPIRED'    THEN 'REQUEST_EXPIRED'
                                WHEN 'PENDING_OTP' THEN 'OTP_TRIGGERED'
                                ELSE 'REQUEST_UPDATED'
                             END;
            v_detail := jsonb_build_object(
                'from_status',        OLD.request_status,
                'to_status',          NEW.request_status,
                'rejection_code',     NEW.rejection_code,
                'rejection_reason',   NEW.rejection_reason,
                'approved_new_limit', NEW.approved_new_limit,
                'otp_required',       NEW.otp_required,
                'otp_verified',       NEW.otp_verified
            );
        ELSE
            -- Non-status update (e.g. fraud_risk_score populated after async check)
            v_event_type  := 'REQUEST_UPDATED';
            v_from_status := OLD.request_status;
            v_to_status   := NEW.request_status;
            v_detail      := jsonb_build_object(
                'updated_fields', (
                    SELECT jsonb_agg(key)
                    FROM jsonb_each(to_jsonb(NEW))
                    WHERE to_jsonb(NEW)->key IS DISTINCT FROM to_jsonb(OLD)->key
                      AND key NOT IN ('updated_at','updated_by','version')
                )
            );
        END IF;
    END IF;

    INSERT INTO credit_limit_request_audit (
        request_id,
        event_type,
        from_status,
        to_status,
        event_detail,
        actor_id,
        actor_type,
        ip_address,
        device_fingerprint_hash,
        session_id,
        event_timestamp
    ) VALUES (
        NEW.request_id,
        v_event_type,
        v_from_status,
        v_to_status,
        v_detail,
        NEW.updated_by,
        CASE WHEN NEW.updated_by = NEW.customer_id THEN 'CUSTOMER' ELSE 'SYSTEM' END,
        NEW.ip_address,
        NEW.device_fingerprint_hash,
        NEW.session_id,
        NOW()
    );

    RETURN NEW;
END;
$$;

-- Attach trigger to the request table
CREATE TRIGGER trg_clir_audit_trail
AFTER INSERT OR UPDATE ON credit_limit_increase_request
FOR EACH ROW
EXECUTE FUNCTION fn_clir_audit_trigger();

-- Function: auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_clir_set_updated_at
BEFORE UPDATE ON credit_limit_increase_request
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS
-- (Deferred to allow table creation order flexibility)
-- =============================================================================

-- Assumes CUSTOMERS and CARDS tables already exist in the schema.
-- Uncomment these once the core tables are confirmed to exist:

-- ALTER TABLE credit_limit_increase_request
--     ADD CONSTRAINT fk_clir_customer_id
--         FOREIGN KEY (customer_id)  REFERENCES customers(customer_id)  ON DELETE RESTRICT,
--     ADD CONSTRAINT fk_clir_card_id
--         FOREIGN KEY (card_id)      REFERENCES cards(card_id)          ON DELETE RESTRICT,
--     ADD CONSTRAINT fk_clir_bureau_pull
--         FOREIGN KEY (bureau_pull_id) REFERENCES bureau_pull_log(pull_id) ON DELETE SET NULL;

-- ALTER TABLE bureau_pull_log
--     ADD CONSTRAINT fk_bpl_customer_id
--         FOREIGN KEY (customer_id)  REFERENCES customers(customer_id)  ON DELETE RESTRICT;

-- ALTER TABLE trusted_devices
--     ADD CONSTRAINT fk_td_customer_id
--         FOREIGN KEY (customer_id)  REFERENCES customers(customer_id)  ON DELETE CASCADE;

-- =============================================================================
-- EXISTING TABLE MODIFICATIONS
-- =============================================================================

-- Add credit-limit-related columns to CARDS if not already present.
-- Each ALTER is wrapped in a DO block to be idempotent (safe to re-run).

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'cards' AND column_name = 'card_type'
    ) THEN
        ALTER TABLE cards ADD COLUMN card_type VARCHAR(10) NOT NULL DEFAULT 'CREDIT'
            CHECK (card_type IN ('CREDIT','DEBIT','PREPAID'));
        COMMENT ON COLUMN cards.card_type IS 'CREDIT or DEBIT. Credit Limit Increase is available for CREDIT cards only.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'cards' AND column_name = 'pan_token'
    ) THEN
        ALTER TABLE cards ADD COLUMN pan_token VARCHAR(200) NULL;
        COMMENT ON COLUMN cards.pan_token IS 'Tokenised PAN from payment vault. Full PAN is never stored in this column or anywhere in the application DB.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'cards' AND column_name = 'credit_limit_increase_eligible'
    ) THEN
        ALTER TABLE cards ADD COLUMN credit_limit_increase_eligible BOOLEAN NOT NULL DEFAULT FALSE;
        COMMENT ON COLUMN cards.credit_limit_increase_eligible IS 'Pre-computed eligibility flag. Refreshed nightly by batch job based on KYC, AML, account status, and credit score band.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'cards' AND column_name = 'last_limit_increase_date'
    ) THEN
        ALTER TABLE cards ADD COLUMN last_limit_increase_date DATE NULL;
        COMMENT ON COLUMN cards.last_limit_increase_date IS 'Date of last approved limit increase. Enforces minimum-days-between-requests policy.';
    END IF;
END $$;

-- Add KYC / AML / credit score band columns to CUSTOMERS if not present.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'customers' AND column_name = 'kyc_status'
    ) THEN
        ALTER TABLE customers ADD COLUMN kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
            CHECK (kyc_status IN ('VERIFIED','PENDING','EXPIRED','REJECTED'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'customers' AND column_name = 'kyc_expiry_date'
    ) THEN
        ALTER TABLE customers ADD COLUMN kyc_expiry_date DATE NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'customers' AND column_name = 'aml_status'
    ) THEN
        ALTER TABLE customers ADD COLUMN aml_status VARCHAR(20) NOT NULL DEFAULT 'CLEAR'
            CHECK (aml_status IN ('CLEAR','FLAGGED','BLOCKED'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'customers' AND column_name = 'credit_score_band'
    ) THEN
        ALTER TABLE customers ADD COLUMN credit_score_band VARCHAR(20) NULL
            CHECK (credit_score_band IN ('EXCELLENT','GOOD','FAIR','POOR','NO_HISTORY'));
        COMMENT ON COLUMN customers.credit_score_band IS 'Non-sensitive score band derived from bureau score. Only band (not exact score) is stored in this table.';
    END IF;
END $$;

-- Add account_status to ACCOUNTS if not present.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'accounts' AND column_name = 'account_status'
    ) THEN
        ALTER TABLE accounts ADD COLUMN account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
            CHECK (account_status IN ('ACTIVE','CLOSED','FROZEN','SUSPENDED','UNDER_INVESTIGATION'));
    END IF;
END $$;

-- =============================================================================
-- TABLE PARTITIONING — credit_limit_request_audit (SOX 7-year retention)
-- =============================================================================
-- The audit table will grow very large over time.
-- Partition by year to keep query performance stable and enable cheap archival.
-- Note: In PostgreSQL, converting an existing table to partitioned requires
-- a data migration. This creates the partitioned version for new deployments.

-- For new deployments (comment out if adding to existing schema):
-- CREATE TABLE credit_limit_request_audit_2026 PARTITION OF credit_limit_request_audit
--     FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
-- CREATE TABLE credit_limit_request_audit_2027 PARTITION OF credit_limit_request_audit
--     FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');

-- =============================================================================
-- DATABASE ROLE GRANTS (Principle of Least Privilege)
-- =============================================================================

-- Application service account: can INSERT/SELECT/UPDATE on request table,
-- but NOT DELETE and NOT UPDATE the audit table.

-- CREATE ROLE app_credit_limit_svc LOGIN PASSWORD '<vault-managed>';

-- GRANT SELECT, INSERT, UPDATE ON credit_limit_increase_request  TO app_credit_limit_svc;
-- GRANT SELECT, INSERT         ON credit_limit_request_audit     TO app_credit_limit_svc;  -- INSERT only, NO UPDATE/DELETE
-- GRANT SELECT, INSERT, UPDATE ON otp_sessions                   TO app_credit_limit_svc;
-- GRANT SELECT                 ON credit_policy_config           TO app_credit_limit_svc;
-- GRANT SELECT, INSERT         ON bureau_pull_log                TO app_credit_limit_svc;
-- GRANT SELECT, INSERT, UPDATE ON trusted_devices                TO app_credit_limit_svc;

-- Compliance read-only role: for reporting and audit review.
-- CREATE ROLE compliance_reader LOGIN PASSWORD '<vault-managed>';
-- GRANT SELECT ON credit_limit_increase_request  TO compliance_reader;
-- GRANT SELECT ON credit_limit_request_audit     TO compliance_reader;
-- GRANT SELECT ON bureau_pull_log                TO compliance_reader;

-- =============================================================================
-- SEED DATA — CREDIT_POLICY_CONFIG
-- =============================================================================

INSERT INTO credit_policy_config
    (config_key, config_value, data_type, description, effective_from, effective_to, is_active, updated_by)
VALUES
    ('MIN_INCREASE_AMOUNT',
     '10000',
     'NUMBER',
     'Minimum credit limit increase amount in INR. Requests below this are rejected at AC3.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('MAX_INCREASE_AMOUNT',
     '2000000',
     'NUMBER',
     'Maximum credit limit increase per single request in INR. Requests above this are rejected at AC3.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('BANK_MAX_CREDIT_LIMIT',
     '3000000',
     'NUMBER',
     'Absolute maximum total credit limit any customer may hold in INR. currentLimit + requestedIncrease must not exceed this.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('MIN_CREDIT_SCORE',
     '650',
     'NUMBER',
     'Minimum CIBIL credit score required for eligibility (AC7). Requests from customers below this score are rejected.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('MAX_UTILIZATION_PCT',
     '80',
     'NUMBER',
     'Maximum credit utilisation percentage permitted for eligibility (AC7). Customers above this are rejected.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('FRAUD_OTP_THRESHOLD',
     '40',
     'NUMBER',
     'Fraud risk score at or above which OTP verification is required before processing (AC8 MEDIUM risk).',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('FRAUD_BLOCK_THRESHOLD',
     '70',
     'NUMBER',
     'Fraud risk score at or above which the request is hard-blocked (AC8 HIGH risk). No OTP fallback.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('BUREAU_CACHE_TTL_HOURS',
     '24',
     'NUMBER',
     'Number of hours a credit bureau pull result is considered fresh. Within TTL, cached score is used without a new bureau enquiry.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('LIMIT_CACHE_TTL_MINS',
     '5',
     'NUMBER',
     'Number of minutes the current credit limit from CBS is cached in Redis before a fresh fetch is needed.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('OTP_TTL_MINUTES',
     '5',
     'NUMBER',
     'Validity period of a generated OTP in minutes. OTPs used after this are rejected as expired.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('OTP_MAX_ATTEMPTS',
     '3',
     'NUMBER',
     'Maximum number of OTP verification attempts before the OTP session is locked.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('OTP_LOCKOUT_MINUTES',
     '15',
     'NUMBER',
     'Lockout duration in minutes after OTP max attempts are exhausted.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('REQUEST_EXPIRY_DAYS',
     '30',
     'NUMBER',
     'Number of days after which a PENDING request automatically transitions to EXPIRED if no decision is made.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('MIN_DAYS_BETWEEN_REQUESTS',
     '90',
     'NUMBER',
     'Minimum number of days a customer must wait between approved credit limit increase requests on the same card.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('VELOCITY_REQUESTS_PER_24H',
     '2',
     'NUMBER',
     'Maximum number of credit limit increase submissions allowed per customer in any rolling 24-hour window. Exceeding this raises fraud score.',
     '2026-01-01', NULL, TRUE, 'SYSTEM'),

    ('SESSION_INACTIVITY_TIMEOUT_MINS',
     '15',
     'NUMBER',
     'Web session inactivity timeout in minutes. Session is invalidated after this period of no user action.',
     '2026-01-01', NULL, TRUE, 'SYSTEM')

ON CONFLICT (config_key) DO NOTHING;  -- idempotent — safe to re-run on existing data

-- =============================================================================
-- VALIDATION QUERIES (run manually after migration to verify)
-- =============================================================================

-- Verify all tables created:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN (
--       'credit_policy_config','bureau_pull_log','credit_limit_increase_request',
--       'credit_limit_request_audit','otp_sessions','trusted_devices'
--   )
-- ORDER BY table_name;

-- Verify seed data:
-- SELECT config_key, config_value, data_type FROM credit_policy_config ORDER BY config_key;

-- Verify trigger:
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE event_object_table = 'credit_limit_increase_request';

-- Verify unique index on duplicate-active-request prevention:
-- SELECT indexname, indexdef FROM pg_indexes
-- WHERE tablename = 'credit_limit_increase_request'
--   AND indexname = 'idx_clir_no_duplicate_active';

COMMIT;

-- =============================================================================
-- ROLLBACK SCRIPT (run in reverse order if migration must be reverted)
-- =============================================================================
-- BEGIN;
-- DROP TRIGGER IF EXISTS trg_clir_audit_trail      ON credit_limit_increase_request;
-- DROP TRIGGER IF EXISTS trg_clir_set_updated_at   ON credit_limit_increase_request;
-- DROP FUNCTION IF EXISTS fn_clir_audit_trigger();
-- DROP FUNCTION IF EXISTS fn_set_updated_at();
-- DROP TABLE IF EXISTS trusted_devices;
-- DROP TABLE IF EXISTS otp_sessions;
-- DROP TABLE IF EXISTS credit_limit_request_audit;
-- DROP TABLE IF EXISTS credit_limit_increase_request;
-- DROP TABLE IF EXISTS bureau_pull_log;
-- DROP TABLE IF EXISTS credit_policy_config;
-- COMMIT;
