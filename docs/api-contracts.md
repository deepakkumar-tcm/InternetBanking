# Credit Limit Increase — API Contracts
**Version:** 1.0.0  
**Base URL:** `https://api.meridianbank.com/internet-banking/v1`  
**Auth:** All endpoints require a valid JWT in an `httpOnly` cookie (`sb_session`). `customerId` is always extracted from the JWT — never from the request body.  
**Transport:** TLS 1.3 minimum on all channels.  
**Content-Type:** `application/json` unless noted otherwise.

---

## Table of Contents
1. [POST /credit-limit/request](#1-post-credit-limitrequest)
2. [GET /credit-limit/current](#2-get-credit-limitcurrent)
3. [GET /credit-limit/requests](#3-get-credit-limitrequests)
4. [GET /credit-limit/status/{requestId}](#4-get-credit-limitstatusrequestid)
5. [POST /credit-limit/otp/verify](#5-post-credit-limitotpverify)
6. [GET /credit-limit/policy](#6-get-credit-limitpolicy)
7. [POST /internal/fraud/assess](#7-post-internalfraudassess)
8. [POST /internal/compliance/check](#8-post-internalcompliancecheck)
9. [Error Code Reference](#9-error-code-reference)

---

## 1. `POST /credit-limit/request`

**Purpose:** Submit a new credit limit increase request. Orchestrates AC1–AC10 validation pipeline.  
**Auth Required:** Yes  
**Idempotency:** Include `Idempotency-Key` header (UUID). Same key within 24 h returns the original response without reprocessing.  
**Rate Limit:** 5 requests / minute per IP; 2 submissions / customer / 24 h.

### Request Headers

| Header | Required | Description |
|---|---|---|
| `Cookie: sb_session=<jwt>` | Yes | Session JWT in httpOnly cookie |
| `Idempotency-Key` | Yes | UUID v4 — prevents duplicate submissions on network retry |
| `X-Device-Fingerprint` | Yes | SHA-256 of device fingerprint string |
| `X-Forwarded-For` | Injected by gateway | Client IP (set by API gateway, not client) |
| `X-Request-ID` | Recommended | Correlation ID for distributed tracing |

### Request Body

```json
{
  "cardId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cardNumberEncrypted": "<RSA-OAEP base64-encoded encrypted PAN>",
  "expiryDate": "12/27",
  "cvvEncrypted": "<RSA-OAEP base64-encoded encrypted CVV>",
  "requestedIncreaseAmount": 50000,
  "currency": "INR",
  "requestReason": "LIFESTYLE_UPGRADE",
  "geoCoordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

### Field Constraints

| Field | Type | Required | Rules |
|---|---|---|---|
| `cardId` | UUID | Yes | Must belong to authenticated customer; credit card only |
| `cardNumberEncrypted` | String | Yes | RSA-OAEP encrypted PAN; server decrypts via HSM; Luhn validated server-side |
| `expiryDate` | String | Yes | Format `MM/YY`; validated against card record |
| `cvvEncrypted` | String | Yes | RSA-OAEP encrypted CVV; validated via HSM iCVV check; never persisted |
| `requestedIncreaseAmount` | Number | Yes | Positive; ≥ `MIN_INCREASE_AMOUNT`; ≤ `MAX_INCREASE_AMOUNT`; `currentLimit + amount` ≤ `BANK_MAX_CREDIT_LIMIT` |
| `currency` | String (ISO 4217) | Yes | `INR` only in current release |
| `requestReason` | String (Enum) | Yes | One of: `BUSINESS_EXPANSION`, `LIFESTYLE_UPGRADE`, `EMERGENCY`, `TRAVEL`, `MEDICAL`, `EDUCATION`, `OTHER` |
| `geoCoordinates` | Object | Recommended | Used for fraud assessment; request proceeds without it but fraud score increases |
| `userAgent` | String | Recommended | Browser/app user agent; used for device profiling |

### Response — 202 Accepted (Request Submitted, Pending Review)

```json
{
  "requestId": "CLR-2026-0047",
  "status": "PENDING",
  "cardMasked": "XXXX XXXX XXXX 8765",
  "cardName": "SecureBank Rewards Credit",
  "currentLimit": 500000,
  "requestedIncrease": 50000,
  "proposedNewLimit": 550000,
  "currency": "INR",
  "submittedAt": "2026-06-10T14:30:45.123Z",
  "estimatedDecisionBy": "2026-06-13",
  "message": "Your request has been received and is pending review. You will be notified within 2–3 business days."
}
```

### Response — 202 Accepted (OTP Required — Medium Fraud Risk)

```json
{
  "requestId": "CLR-2026-0048",
  "status": "PENDING_OTP",
  "action": "REQUIRE_OTP",
  "otpSessionId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "otpExpiresAt": "2026-06-10T14:35:45.000Z",
  "maskedMobile": "XXXXXX7890",
  "message": "Additional verification required. An OTP has been sent to your registered mobile number."
}
```

### Response — 422 Unprocessable (Validation Failure)

```json
{
  "requestId": "CLR-2026-0049",
  "status": "REJECTED",
  "rejectionCode": "AC07_CREDIT_SCORE_BELOW_MINIMUM",
  "rejectionMessage": "Customer does not meet minimum credit eligibility requirements.",
  "submittedAt": "2026-06-10T14:31:02.000Z",
  "supportReference": "ERR-2026-0049-A7"
}
```

### Response — 409 Conflict (Duplicate Active Request)

```json
{
  "error": "DUPLICATE_ACTIVE_REQUEST",
  "message": "A pending credit limit increase request already exists for this card.",
  "existingRequestId": "CLR-2026-0044",
  "existingStatus": "PENDING"
}
```

---

## 2. `GET /credit-limit/current`

**Purpose:** Retrieve the current credit limit, available credit, and outstanding balance for a credit card.  
**Auth Required:** Yes  
**Caching:** Redis, TTL = `LIMIT_CACHE_TTL_MINS` (default 5 min). Response includes `Cache-Control: max-age=300` and `X-Cache: HIT|MISS` headers.

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `cardId` | UUID | Yes | ID of the credit card |

### Request Example

```
GET /credit-limit/current?cardId=3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Response — 200 OK

```json
{
  "cardId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cardMasked": "XXXX XXXX XXXX 8765",
  "cardName": "SecureBank Rewards Credit",
  "brand": "Mastercard",
  "currentLimit": 500000,
  "outstandingBalance": 125000,
  "availableCredit": 375000,
  "utilizationRatio": 25.00,
  "currency": "INR",
  "asOfTimestamp": "2026-06-10T14:00:00.000Z",
  "dataSource": "CBS_LIVE",
  "stale": false
}
```

**Notes:**
- `dataSource`: `CBS_LIVE` = fresh from core banking; `CBS_CACHED` = served from Redis cache.
- `stale`: `true` if CBS was unavailable and last-known cached value is being returned. UI must display a data-freshness warning in this case.

### Response — 503 Service Unavailable (CBS and cache both unavailable)

```json
{
  "error": "CBS_UNAVAILABLE",
  "message": "Unable to retrieve current credit limit. Please try again later.",
  "retryAfterSeconds": 30
}
```

---

## 3. `GET /credit-limit/requests`

**Purpose:** List all credit limit increase requests for the authenticated customer.  
**Auth Required:** Yes  
**Pagination:** Cursor-based. Default page size: 10. Maximum: 50.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `cardId` | UUID | No | — | Filter by specific card |
| `status` | String (CSV) | No | all | Comma-separated: `PENDING,APPROVED,REJECTED,CANCELLED,EXPIRED` |
| `page` | Integer | No | 0 | Zero-indexed page number |
| `size` | Integer | No | 10 | Records per page (max 50) |
| `sortBy` | String | No | `requestDate` | `requestDate` or `status` |
| `sortDir` | String | No | `DESC` | `ASC` or `DESC` |

### Response — 200 OK

```json
{
  "content": [
    {
      "requestId": "CLR-2026-0047",
      "cardMasked": "XXXX XXXX XXXX 8765",
      "cardName": "SecureBank Rewards Credit",
      "currentLimit": 500000,
      "requestedIncrease": 50000,
      "proposedNewLimit": 550000,
      "approvedNewLimit": null,
      "creditScoreAtRequest": 720,
      "scoreBandAtRequest": "GOOD",
      "utilizationAtRequest": 25.00,
      "currency": "INR",
      "status": "PENDING",
      "requestReason": "LIFESTYLE_UPGRADE",
      "requestedAt": "2026-06-10T14:30:45.000Z",
      "decisionAt": null,
      "estimatedDecisionBy": "2026-06-13",
      "rejectionCode": null,
      "rejectionReason": null
    },
    {
      "requestId": "CLR-2025-0012",
      "cardMasked": "XXXX XXXX XXXX 8765",
      "cardName": "SecureBank Rewards Credit",
      "currentLimit": 300000,
      "requestedIncrease": 200000,
      "proposedNewLimit": 500000,
      "approvedNewLimit": 500000,
      "creditScoreAtRequest": 700,
      "scoreBandAtRequest": "GOOD",
      "utilizationAtRequest": 38.00,
      "currency": "INR",
      "status": "APPROVED",
      "requestReason": "BUSINESS_EXPANSION",
      "requestedAt": "2025-12-15T10:30:45.000Z",
      "decisionAt": "2025-12-16T14:05:12.000Z",
      "estimatedDecisionBy": null,
      "rejectionCode": null,
      "rejectionReason": null
    }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

## 4. `GET /credit-limit/status/{requestId}`

**Purpose:** Retrieve the current status and details of a specific request.  
**Auth Required:** Yes  
**Access Control:** Returns 403 if the `requestId` does not belong to the authenticated customer.

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `requestId` | String | Yes | Format: `CLR-YYYY-NNNN` |

### Response — 200 OK

```json
{
  "requestId": "CLR-2026-0047",
  "cardMasked": "XXXX XXXX XXXX 8765",
  "cardName": "SecureBank Rewards Credit",
  "currentLimit": 500000,
  "requestedIncrease": 50000,
  "proposedNewLimit": 550000,
  "approvedNewLimit": null,
  "currency": "INR",
  "status": "PENDING",
  "statusDescription": "Your request is under review by our credit team.",
  "requestedAt": "2026-06-10T14:30:45.000Z",
  "lastUpdatedAt": "2026-06-10T14:30:45.000Z",
  "estimatedDecisionBy": "2026-06-13",
  "decisionAt": null,
  "rejectionCode": null,
  "rejectionReason": null,
  "auditTrail": [
    {
      "eventType": "REQUEST_SUBMITTED",
      "eventDescription": "Request submitted by customer",
      "eventTimestamp": "2026-06-10T14:30:45.000Z",
      "actorType": "CUSTOMER"
    },
    {
      "eventType": "COMPLIANCE_CHECK_PASSED",
      "eventDescription": "All AC4–AC10 compliance checks passed",
      "eventTimestamp": "2026-06-10T14:30:46.500Z",
      "actorType": "SYSTEM"
    }
  ]
}
```

### Response — 403 Forbidden

```json
{
  "error": "ACCESS_DENIED",
  "message": "You do not have permission to access this request."
}
```

### Response — 404 Not Found

```json
{
  "error": "REQUEST_NOT_FOUND",
  "message": "No credit limit increase request found with ID CLR-2026-0099."
}
```

---

## 5. `POST /credit-limit/otp/verify`

**Purpose:** Verify the OTP sent for medium-risk (AC8) requests.  
**Auth Required:** Yes  
**Rate Limit:** 3 attempts per `otpSessionId` then 15-minute lockout.

### Request Body

```json
{
  "otpSessionId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "requestId": "CLR-2026-0048",
  "otpCode": "847291"
}
```

### Field Constraints

| Field | Type | Required | Rules |
|---|---|---|---|
| `otpSessionId` | UUID | Yes | Must match an active OTP session linked to `requestId` |
| `requestId` | String | Yes | Must be in `PENDING_OTP` status |
| `otpCode` | String | Yes | Exactly 6 digits; validated against bcrypt hash in `OTP_SESSIONS` |

### Response — 200 OK (OTP Verified)

```json
{
  "verified": true,
  "requestId": "CLR-2026-0048",
  "status": "PENDING",
  "message": "OTP verified successfully. Your request is now pending review."
}
```

### Response — 400 Bad Request (Wrong OTP)

```json
{
  "verified": false,
  "error": "OTP_INVALID",
  "message": "Incorrect OTP. 2 attempt(s) remaining.",
  "attemptsRemaining": 2
}
```

### Response — 400 Bad Request (OTP Expired)

```json
{
  "verified": false,
  "error": "OTP_EXPIRED",
  "message": "OTP has expired. Please restart your request to receive a new OTP.",
  "expiredAt": "2026-06-10T14:35:45.000Z"
}
```

### Response — 429 Too Many Requests (Locked)

```json
{
  "verified": false,
  "error": "OTP_LOCKED",
  "message": "Too many failed attempts. Please try again after 15 minutes.",
  "lockedUntil": "2026-06-10T14:50:45.000Z"
}
```

---

## 6. `GET /credit-limit/policy`

**Purpose:** Return current bank policy configuration values so the UI can display accurate hints and perform client-side pre-validation. **Server always re-validates — client values are for UX only.**  
**Auth Required:** Yes  
**Caching:** `Cache-Control: max-age=3600` (1 hour; policy changes are infrequent).

### Response — 200 OK

```json
{
  "minIncreaseAmount": 10000,
  "maxIncreaseAmount": 2000000,
  "bankMaxCreditLimit": 3000000,
  "minCreditScore": 650,
  "maxUtilizationPct": 80,
  "currency": "INR",
  "effectiveFrom": "2026-01-01",
  "minDaysBetweenRequests": 90
}
```

---

## 7. `POST /internal/fraud/assess`

**Purpose:** Internal service-to-service endpoint. Called by `CreditLimitRequestService` only — **not exposed to the browser or API gateway**.  
**Auth:** mTLS between internal services.

### Request Body

```json
{
  "customerId": "CUST-7821",
  "eventType": "CREDIT_LIMIT_INCREASE",
  "deviceFingerprintHash": "a3f5c8d2e1b4a7f6c9d0e3b2a1f4c7d8e0b3a6f9c2d5e8b1a4f7c0d3e6b9a2",
  "ipAddress": "192.168.1.10",
  "geoCoordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "countryCode": "IN",
    "city": "Bengaluru"
  },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "sessionId": "sess-3fa85f64-5717-4562-b3fc",
  "requestTimestamp": "2026-06-10T14:30:45.123Z",
  "previousRequestsLast24h": 0
}
```

### Response — 200 OK

```json
{
  "assessmentId": "fraud-assess-3fa85f64-5717",
  "customerId": "CUST-7821",
  "riskScore": 18,
  "riskLevel": "LOW",
  "action": "PROCEED",
  "signals": [],
  "assessedAt": "2026-06-10T14:30:45.623Z",
  "processingTimeMs": 487
}
```

**Risk Level → Action Mapping:**

| Score Range | Risk Level | Action |
|---|---|---|
| 0–39 | LOW | `PROCEED` |
| 40–69 | MEDIUM | `REQUIRE_OTP` |
| 70–100 | HIGH | `BLOCK` |

**Example Signals:**

| Signal Code | Description | Score Impact |
|---|---|---|
| `UNKNOWN_DEVICE` | Device fingerprint not in trusted device list | +15 |
| `IP_GEO_MISMATCH` | IP country differs from customer's registered country | +20 |
| `HIGH_RISK_GEOGRAPHY` | IP geolocates to sanctioned or high-fraud country | +50 |
| `VELOCITY_BREACH_24H` | More than `VELOCITY_REQUESTS_PER_24H` requests in rolling window | +30 |
| `RAPID_POST_LOGIN` | Request submitted < 30 seconds after login | +10 |
| `MULTIPLE_FAILED_LOGINS` | > 5 failed login attempts in last hour | +25 |
| `DEVICE_BLACKLISTED` | Device hash in fraud blacklist | +100 (auto-BLOCK) |

---

## 8. `POST /internal/compliance/check`

**Purpose:** Internal endpoint for AML screening and PCI DSS / SOX validation. Called by `CreditLimitRequestService` only.  
**Auth:** mTLS between internal services.

### Request Body

```json
{
  "customerId": "CUST-7821",
  "cifNumber": "CIF-089123",
  "cardId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "requestedAmount": 50000,
  "currency": "INR",
  "eventType": "CREDIT_LIMIT_INCREASE",
  "requestId": "CLR-2026-0047",
  "requestTimestamp": "2026-06-10T14:30:45.123Z"
}
```

### Response — 200 OK

```json
{
  "complianceCheckId": "comp-check-3fa85f64",
  "customerId": "CUST-7821",
  "amlStatus": "CLEAR",
  "sanctionsMatch": false,
  "sanctionsProvider": "DOW_JONES_WATCHLIST",
  "screensMatchedCount": 0,
  "pciCompliant": true,
  "pciNotes": "PAN tokenised. CVV not persisted. TLS 1.3 confirmed.",
  "soxAuditCreated": true,
  "soxAuditId": "audit-00142",
  "overallCompliant": true,
  "checkedAt": "2026-06-10T14:30:46.001Z",
  "processingTimeMs": 312
}
```

### Response — 200 OK (AML Flagged)

```json
{
  "complianceCheckId": "comp-check-3fa85f64",
  "customerId": "CUST-7821",
  "amlStatus": "FLAGGED",
  "sanctionsMatch": true,
  "sanctionsProvider": "OFAC_SDN",
  "screensMatchedCount": 1,
  "pciCompliant": true,
  "soxAuditCreated": true,
  "overallCompliant": false,
  "rejectionCode": "AC10_AML_SCREENING_FAILED",
  "rejectionMessage": "Request cannot be processed at this time.",
  "checkedAt": "2026-06-10T14:30:46.001Z"
}
```

**Note:** When `amlStatus = FLAGGED`, the service also fires an internal `COMPLIANCE_ALERT` event to notify the compliance team. The rejection message shown to the customer is intentionally vague.

---

## 9. Error Code Reference

### Validation Errors (400 Bad Request)

| Code | HTTP | Triggering Condition | Customer Message |
|---|---|---|---|
| `INVALID_CARD_NUMBER_FORMAT` | 400 | Non-numeric or wrong length | `Card number must be 13–19 digits, numeric only.` |
| `INVALID_CARD_NUMBER_LUHN` | 400 | Luhn check fails | `Invalid card number. Please check and re-enter.` |
| `INVALID_EXPIRY_FORMAT` | 400 | Not `MM/YY` | `Enter expiry date as MM/YY (e.g. 06/29).` |
| `CARD_EXPIRED` | 400 | Expiry date in past | `This card has expired and is not eligible.` |
| `INVALID_CVV_FORMAT` | 400 | Not 3–4 digits | `CVV must be 3 or 4 digits.` |
| `AMOUNT_REQUIRED` | 400 | Amount missing or zero | `Please enter the increase amount you are requesting.` |
| `AMOUNT_BELOW_MINIMUM` | 400 | Amount < policy min | `Minimum increase amount is ₹10,000.` |
| `AMOUNT_EXCEEDS_MAXIMUM` | 400 | Amount > policy max | `Maximum single increase request is ₹20,00,000.` |
| `BANK_LIMIT_EXCEEDED` | 400 | New limit > bank cap | `Requested credit limit exceeds the allowable maximum of ₹30,00,000.` |

### Authentication & Authorization Errors

| Code | HTTP | Triggering Condition | Customer Message |
|---|---|---|---|
| `SESSION_EXPIRED` | 401 | JWT expired | `Your session has expired. Please log in again.` |
| `SESSION_INVALID` | 401 | JWT tampered or missing | `Authentication required. Please log in.` |
| `CARD_NOT_OWNED` | 403 | Card does not belong to JWT customer | `You do not have access to this card.` |
| `ACCESS_DENIED` | 403 | Resource belongs to different customer | `You do not have permission to access this request.` |

### Business Rule Rejections (422 Unprocessable Entity)

| Code | HTTP | AC | Customer Message |
|---|---|---|---|
| `AC01_CARD_NOT_FOUND` | 422 | AC1 | `Credit card details could not be verified.` |
| `AC01_CVV_INVALID` | 422 | AC1 | `Credit card details could not be verified.` (vague — prevents CVV oracle) |
| `AC01_CARD_MISMATCH` | 422 | AC1 | `Credit card details could not be verified.` |
| `AC06_ACCOUNT_INACTIVE` | 422 | AC6 | `Credit limit increase requests are unavailable for this account.` |
| `AC06_CARD_NOT_ACTIVE` | 422 | AC6 | `Credit limit increase requests are unavailable for this account.` |
| `AC07_CREDIT_SCORE_BELOW_MINIMUM` | 422 | AC7 | `Customer does not meet minimum credit eligibility requirements.` |
| `AC07_UTILIZATION_TOO_HIGH` | 422 | AC7 | `Customer does not meet minimum credit eligibility requirements.` |
| `AC09_KYC_NOT_VERIFIED` | 422 | AC9 | `KYC verification must be completed before requesting a credit limit increase.` |
| `AC09_KYC_EXPIRED` | 422 | AC9 | `KYC verification must be completed before requesting a credit limit increase.` |
| `AC10_AML_SCREENING_FAILED` | 422 | AC10 | `Request cannot be processed at this time.` (intentionally vague) |
| `AC08_FRAUD_HIGH_RISK` | 422 | AC8 | `Request cannot be processed due to security concerns.` |

### Conflict Errors (409)

| Code | HTTP | Triggering Condition | Customer Message |
|---|---|---|---|
| `DUPLICATE_ACTIVE_REQUEST` | 409 | PENDING or PENDING_OTP already exists for this card | `A pending credit limit increase request already exists for this card.` |
| `MIN_DAYS_NOT_ELAPSED` | 409 | Last approved increase was less than `MIN_DAYS_BETWEEN_REQUESTS` days ago | `A credit limit increase was recently approved. Please wait before submitting a new request.` |

### Dependency Errors (503)

| Code | HTTP | Triggering Condition | Customer Message |
|---|---|---|---|
| `CBS_UNAVAILABLE` | 503 | Core banking system unreachable and no cache | `Unable to retrieve current credit limit. Please try again later.` |
| `BUREAU_UNAVAILABLE` | 503 | Credit bureau API unreachable and cache expired | `Credit assessment temporarily unavailable. Please try again later.` |
| `FRAUD_ENGINE_UNAVAILABLE` | 503 | Fraud engine unreachable after retries | Fail-secure: treat as MEDIUM, trigger OTP. Do not surface this error to customer. |

### Standard HTTP Error Response Schema

All error responses use this consistent structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message safe to display to the customer.",
  "requestId": "CLR-2026-0049",
  "timestamp": "2026-06-10T14:31:02.000Z",
  "supportReference": "ERR-2026-0049-A7",
  "details": []
}
```

**Note:** `details` is only populated for 400 validation errors with multiple field failures. For security, never include stack traces, internal service names, database table names, or infrastructure details in error responses.

---

## Security Headers

All API responses must include:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none'
Cache-Control: no-store                        (for all authenticated responses)
X-Request-ID: <correlation-id>
```

## API Versioning

This contract is version `v1`. Breaking changes will increment to `v2`. Non-breaking additions (new optional fields, new endpoints) may be added to `v1` without versioning. Deprecated fields will be flagged with `"deprecated": true` in the response for at least 6 months before removal.
