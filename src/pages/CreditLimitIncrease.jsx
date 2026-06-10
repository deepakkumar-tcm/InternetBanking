import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import {
  CreditCard, TrendingUp, CheckCircle2, XCircle, Clock, Shield,
  AlertTriangle, Loader2, ArrowRight, ChevronRight, Info, Lock,
  FileCheck, User, Fingerprint, BadgeCheck, Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Policy Constants (UI hints only — server always re-validates) ─────────
const MIN_INCREASE   = 10000    // ₹10,000
const MAX_INCREASE   = 2000000  // ₹20,00,000
const BANK_MAX_LIMIT = 3000000  // ₹30,00,000

// ─── Mock: Customer Profile ────────────────────────────────────────────────
const CUSTOMER = {
  customerId:      'CUST-7821',
  cifNumber:       'CIF-089123',
  accountId:       'ACC-001',
  name:            'Rajesh Kumar',
  creditScore:     720,
  utilizationRatio: 45,
  kycStatus:       'Verified',
  kycExpiry:       '2027-12-31',
  amlStatus:       'Clear',
  fraudRiskScore:  18,
  riskLevel:       'LOW',   // LOW | MEDIUM | HIGH — change to test other flows
}

// ─── Mock: Credit Cards ────────────────────────────────────────────────────
const CREDIT_CARDS = [
  {
    id: 1,
    name:           'SecureBank Rewards Credit',
    maskedNumber:   '**** **** **** 8765',
    lastFour:       '8765',
    demoFullNumber: '5425233430108765',
    holder:         'RAJESH KUMAR',
    expiry:         '12/27',
    demoCvv:        '123',
    brand:          'Mastercard',
    cardStatus:     'Active',
    accountStatus:  'Active',
    limit:          500000,
    used:           125000,
    color:          'from-blue-700 to-indigo-800',
  },
  {
    id: 2,
    name:           'SecureBank Business Credit',
    maskedNumber:   '**** **** **** 3456',
    lastFour:       '3456',
    demoFullNumber: '4916338506083456',
    holder:         'RAJESH KUMAR',
    expiry:         '06/29',
    demoCvv:        '456',
    brand:          'Visa',
    cardStatus:     'Suspended',   // AC6 demo: suspended card → rejected
    accountStatus:  'Active',
    limit:          1000000,
    used:           230000,
    color:          'from-violet-700 to-purple-800',
  },
]

// ─── Mock: Request History ─────────────────────────────────────────────────
const INITIAL_REQUESTS = [
  {
    id:               'CLR-2025-001',
    cardMasked:       '**** **** **** 8765',
    cardName:         'SecureBank Rewards Credit',
    currentLimit:     300000,
    increaseAmount:   200000,
    newLimit:         500000,
    creditScore:      700,
    utilizationRatio: 38,
    kycStatus:        'Verified',
    fraudRiskScore:   12,
    status:           'Approved',
    requestDate:      '2025-12-15T10:30:45Z',
    approvalDate:     '2025-12-16T14:05:12Z',
    rejectionReason:  null,
  },
  {
    id:               'CLR-2026-001',
    cardMasked:       '**** **** **** 8765',
    cardName:         'SecureBank Rewards Credit',
    currentLimit:     500000,
    increaseAmount:   2500000,
    newLimit:         3000000,
    creditScore:      720,
    utilizationRatio: 45,
    kycStatus:        'Verified',
    fraudRiskScore:   8,
    status:           'Rejected',
    requestDate:      '2026-03-20T09:15:33Z',
    approvalDate:     null,
    rejectionReason:  'Requested credit limit exceeds the allowable maximum of ₹30,00,000',
  },
]

// ─── Compliance Check Definitions ─────────────────────────────────────────
const CHECKS = [
  { id: 'customer_id',  icon: User,        label: 'Customer Identity',        desc: 'Verifying Customer ID, CIF & Account' },
  { id: 'card_account', icon: CreditCard,  label: 'Account & Card Status',    desc: 'Confirming active status on account and card' },
  { id: 'credit_score', icon: TrendingUp,  label: 'Credit Score Evaluation',  desc: 'Minimum score required: 650' },
  { id: 'utilization',  icon: FileCheck,   label: 'Credit Utilization Check', desc: 'Maximum allowed utilization: 80%' },
  { id: 'kyc',          icon: BadgeCheck,  label: 'KYC Status Verification',  desc: 'Identity documents & expiry check' },
  { id: 'fraud',        icon: Fingerprint, label: 'Fraud Risk Assessment',    desc: 'Device fingerprint, geolocation & velocity' },
  { id: 'aml',          icon: Search,      label: 'AML & Sanctions Screening',desc: 'Anti-money laundering & watchlist check' },
  { id: 'pci_sox',      icon: Lock,        label: 'PCI DSS / SOX Compliance', desc: 'Data masking, encryption & audit trail' },
]

// ─── Field-level Card Validation (CVV only — number/expiry are auto-filled) ─
function validateCardFields(cvv) {
  const errs = {}
  if (!cvv)
    errs.cvv = 'CVV is required.'
  else if (!/^\d{3,4}$/.test(cvv))
    errs.cvv = 'CVV must be 3 or 4 digits.'
  return errs
}

// ─── Evaluate a single compliance check ───────────────────────────────────
function evaluateCheck(checkId, card) {
  switch (checkId) {
    case 'customer_id':
      return { status: 'pass', message: `${CUSTOMER.customerId} · ${CUSTOMER.cifNumber} verified` }
    case 'card_account':
      if (card.accountStatus !== 'Active')
        return { status: 'fail', message: `Account status: ${card.accountStatus}. Credit limit increase requests are unavailable for this account.` }
      if (card.cardStatus !== 'Active')
        return { status: 'fail', message: `Card status: ${card.cardStatus}. Credit limit increase requests are unavailable for this account.` }
      return { status: 'pass', message: 'Account: Active · Card: Active' }
    case 'credit_score':
      if (CUSTOMER.creditScore < 650)
        return { status: 'fail', message: `Customer does not meet minimum credit eligibility requirements. Score: ${CUSTOMER.creditScore} (min 650).` }
      return { status: 'pass', message: `Score: ${CUSTOMER.creditScore} — Eligible` }
    case 'utilization':
      if (CUSTOMER.utilizationRatio > 80)
        return { status: 'fail', message: `Customer does not meet minimum credit eligibility requirements. Utilization: ${CUSTOMER.utilizationRatio}% (max 80%).` }
      return { status: 'pass', message: `Utilization: ${CUSTOMER.utilizationRatio}% — Within limit` }
    case 'kyc':
      if (CUSTOMER.kycStatus !== 'Verified')
        return { status: 'fail', message: 'KYC verification must be completed before requesting a credit limit increase.' }
      return { status: 'pass', message: `KYC: ${CUSTOMER.kycStatus} · Expires: ${CUSTOMER.kycExpiry}` }
    case 'fraud':
      if (CUSTOMER.riskLevel === 'HIGH')
        return { status: 'fail', message: 'Request cannot be processed due to security concerns.' }
      if (CUSTOMER.riskLevel === 'MEDIUM')
        return { status: 'warn', message: 'Additional verification required. OTP will be sent to your registered mobile.' }
      return { status: 'pass', message: `Risk score: ${CUSTOMER.fraudRiskScore}/100 — LOW RISK` }
    case 'aml':
      if (CUSTOMER.amlStatus !== 'Clear')
        return { status: 'fail', message: 'Request cannot be processed at this time.' }
      return { status: 'pass', message: 'AML: Clear · No sanctions match' }
    case 'pci_sox':
      return { status: 'pass', message: 'Card data masked · TLS 1.3 · Audit trail created' }
    default:
      return { status: 'pass', message: 'Check passed' }
  }
}

function genRequestId() {
  return `CLR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000 + 1000))}`
}

const STATUS_BADGE = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  Pending:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
  Rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
}

// ══════════════════════════════════════════════════════════════════════════
export default function CreditLimitIncrease() {
  const [requests, setRequests]     = useState(INITIAL_REQUESTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [step, setStep]             = useState(1)

  // Step 1 – Card Verification
  const [selectedCardId, setSelectedCardId] = useState('')
  const [cvv, setCvv]                       = useState('')
  const [cardErrors, setCardErrors]         = useState({})
  const [showHint, setShowHint]             = useState(false)

  // Step 2 – Amount
  const [increaseAmount, setIncreaseAmount] = useState('')
  const [amountError, setAmountError]       = useState('')

  // Step 3 – Compliance
  const [processingIndex, setProcessingIndex] = useState(-1)
  const [checkResults, setCheckResults]       = useState({})
  const [processingDone, setProcessingDone]   = useState(false)
  const [overallResult, setOverallResult]     = useState(null)
  const [failReason, setFailReason]           = useState('')

  // Step 4 – OTP
  const [otp, setOtp]                 = useState('')
  const [otpVerifying, setOtpVerifying] = useState(false)

  // Step 5 – Result
  const [submittedReq, setSubmittedReq] = useState(null)

  useEffect(() => { console.log('[ROUTE] /credit-limit') }, [])

  const selectedCard = CREDIT_CARDS.find(c => c.id === Number(selectedCardId))

  const openDialog  = () => { resetWizard(); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setTimeout(resetWizard, 300) }

  const resetWizard = () => {
    setStep(1)
    setSelectedCardId(''); setCvv('')
    setCardErrors({}); setShowHint(false)
    setIncreaseAmount(''); setAmountError('')
    setProcessingIndex(-1); setCheckResults({})
    setProcessingDone(false); setOverallResult(null); setFailReason('')
    setOtp(''); setOtpVerifying(false); setSubmittedReq(null)
  }

  // ── Step 1 ───────────────────────────────────────────────────────────────
  const handleVerifyCard = () => {
    if (!selectedCardId) { toast.error('Please select a credit card.'); return }
    const errs = validateCardFields(cvv)
    if (Object.keys(errs).length) { setCardErrors(errs); return }
    setCardErrors({})
    setStep(2)
  }

  // ── Step 2 ───────────────────────────────────────────────────────────────
  const handleSubmitRequest = () => {
    const amt = parseFloat(increaseAmount)
    if (!increaseAmount || isNaN(amt)) return setAmountError('Please enter a valid amount.')
    if (amt <= 0)                       return setAmountError('Amount must be a positive value.')
    if (amt < MIN_INCREASE)             return setAmountError(`Minimum increase is ${formatCurrency(MIN_INCREASE)}.`)
    if (amt > MAX_INCREASE)             return setAmountError(`Maximum increase is ${formatCurrency(MAX_INCREASE)}.`)
    if (selectedCard && (selectedCard.limit + amt) > BANK_MAX_LIMIT)
      return setAmountError(`Requested credit limit exceeds the allowable maximum of ${formatCurrency(BANK_MAX_LIMIT)}.`)
    setAmountError('')
    const card = selectedCard   // capture before async
    setStep(3)
    setTimeout(() => runChecks(card), 120)
  }

  // ── Step 3 – async compliance simulation ─────────────────────────────────
  const runChecks = async (card) => {
    const results = {}
    for (let i = 0; i < CHECKS.length; i++) {
      setProcessingIndex(i)
      await new Promise(r => setTimeout(r, 550 + Math.random() * 450))
      const result = evaluateCheck(CHECKS[i].id, card)
      results[CHECKS[i].id] = result
      setCheckResults(prev => ({ ...prev, [CHECKS[i].id]: result }))
      if (result.status === 'fail') {
        setProcessingDone(true)
        setOverallResult('fail')
        setFailReason(result.message)
        return
      }
    }
    setProcessingIndex(CHECKS.length)
    setProcessingDone(true)
    const hasWarn = Object.values(results).some(r => r.status === 'warn')
    setOverallResult(hasWarn ? 'otp_required' : 'pass')
  }

  const handleNextFromProcessing = () => {
    if (overallResult === 'pass')         finalizeRequest()
    else if (overallResult === 'otp_required') setStep(4)
    else                                  setStep(5)
  }

  // ── Step 4 ───────────────────────────────────────────────────────────────
  const handleVerifyOtp = () => {
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP.'); return }
    setOtpVerifying(true)
    setTimeout(() => { setOtpVerifying(false); finalizeRequest() }, 1500)
  }

  // ── Finalize ─────────────────────────────────────────────────────────────
  const finalizeRequest = () => {
    const now = new Date()
    const newReq = {
      id:               genRequestId(),
      cardMasked:       selectedCard.maskedNumber,
      cardName:         selectedCard.name,
      currentLimit:     selectedCard.limit,
      increaseAmount:   parseFloat(increaseAmount),
      newLimit:         selectedCard.limit + parseFloat(increaseAmount),
      creditScore:      CUSTOMER.creditScore,
      utilizationRatio: CUSTOMER.utilizationRatio,
      kycStatus:        CUSTOMER.kycStatus,
      fraudRiskScore:   CUSTOMER.fraudRiskScore,
      status:           'Pending',
      requestDate:      now.toISOString(),
      approvalDate:     null,
      rejectionReason:  null,
    }
    setSubmittedReq(newReq)
    setRequests(prev => [newReq, ...prev])
    // Persist so Dashboard pending-request banner can read it
    const stored = JSON.parse(localStorage.getItem('clr_pending_requests') || '[]')
    localStorage.setItem('clr_pending_requests', JSON.stringify([newReq, ...stored]))
    setStep(5)
    toast.success(`Request ${newReq.id} submitted for review.`)
  }

  // ── Derived counts ────────────────────────────────────────────────────────
  const approved = requests.filter(r => r.status === 'Approved').length
  const pending  = requests.filter(r => r.status === 'Pending').length
  const rejected = requests.filter(r => r.status === 'Rejected').length

  const progressPct = processingIndex < 0
    ? 0 : Math.round((Math.min(processingIndex + 1, CHECKS.length) / CHECKS.length) * 100)

  // ── Wizard step labels ────────────────────────────────────────────────────
  const STEP_LABELS = ['Card Verify', 'Amount', 'Checks', ...(overallResult === 'otp_required' ? ['OTP'] : []), 'Result']

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-fade-in" id="credit-limit-page">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium" id="breadcrumb">
        <CreditCard className="h-3.5 w-3.5" />
        <span>Cards</span>
        <ChevronRight className="h-3 w-3" />
        <span>Credit Card Services</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Increase Credit Limit</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Credit Limit Increase</h2>
          <p className="text-sm text-muted-foreground mt-1">Request a higher credit limit on your SecureBank credit card</p>
        </div>
        <Button onClick={openDialog} id="btn-new-request">
          <TrendingUp className="h-4 w-4 mr-2" />New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="clr-stats">
        {[
          { label: 'Total Requests', value: requests.length, icon: FileCheck,    color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950' },
          { label: 'Approved',       value: approved,        icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
          { label: 'Pending Review', value: pending,         icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950' },
          { label: 'Rejected',       value: rejected,        icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-950' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border shadow-sm" id={`stat-${s.label.toLowerCase().replace(/\s+/g,'-')}`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Policy Banner */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800" id="policy-banner">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Bank Policy —</strong>&nbsp;
          Min increase: {formatCurrency(MIN_INCREASE)} &nbsp;·&nbsp;
          Max increase: {formatCurrency(MAX_INCREASE)} &nbsp;·&nbsp;
          Max total limit: {formatCurrency(BANK_MAX_LIMIT)}.&nbsp;
          Requires credit score ≥ 650 and utilization ≤ 80%.
        </AlertDescription>
      </Alert>

      {/* Request History Table */}
      <Card className="border shadow-sm" id="clr-history-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold">Request History</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">All credit limit increase requests for your account</p>
          </div>
          <Badge variant="outline">{requests.length} request{requests.length !== 1 ? 's' : ''}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm" id="empty-state">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No requests yet. Click <strong>New Request</strong> to get started.
            </div>
          ) : (
            <Table id="clr-history-table">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6 text-xs uppercase tracking-wider font-bold">Request ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Card</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">Current Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">Increase</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">New Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center">Score</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id} id={`row-${req.id}`} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-primary">{req.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-[160px]">{req.cardName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{req.cardMasked}</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatCurrency(req.currentLimit)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-emerald-600">+{formatCurrency(req.increaseAmount)}</TableCell>
                    <TableCell className="text-right font-bold text-sm">{formatCurrency(req.newLimit)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-bold ${req.creditScore >= 650 ? 'text-emerald-600' : 'text-red-500'}`}>{req.creditScore}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(req.requestDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Badge variant="outline" className={STATUS_BADGE[req.status] || ''} id={`status-${req.id}`}>{req.status}</Badge>
                      {req.rejectionReason && (
                        <p className="text-[10px] text-red-500 mt-0.5 max-w-[160px] text-left leading-tight">{req.rejectionReason}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          WIZARD DIALOG
      ══════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent
          className="sm:max-w-lg max-h-[92vh] overflow-y-auto"
          id="clr-dialog"
          onPointerDownOutside={e => { if (step === 3 && !processingDone) e.preventDefault() }}
        >
          {/* Step dots */}
          <div className="flex items-center gap-1 mb-1" id="wizard-dots">
            {[1, 2, 3, 4, 5].map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                  ${step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {step > s ? '✓' : i + 1}
                </div>
                {i < 4 && <div className={`h-0.5 flex-1 rounded ${step > s ? 'bg-emerald-400' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Card Verification (AC1) ───────────────────── */}
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Verify Your Credit Card</DialogTitle>
                <DialogDescription>Select your card and enter the CVV to confirm identity. (AC1)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2" id="step1-form">

                {/* Card selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest" htmlFor="sel-card">
                    Credit Card <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedCardId} onValueChange={v => { setSelectedCardId(v); setCardErrors({}); setCvv('') }}>
                    <SelectTrigger id="sel-card"><SelectValue placeholder="Select a credit card" /></SelectTrigger>
                    <SelectContent>
                      {CREDIT_CARDS.map(c => (
                        <SelectItem key={c.id} value={String(c.id)} id={`sel-card-${c.id}`}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{c.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">{c.maskedNumber}</span>
                            {c.cardStatus !== 'Active' && (
                              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200 ml-1">{c.cardStatus}</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto-filled card details (read-only) */}
                {selectedCard && (
                  <div className={`rounded-xl bg-gradient-to-br ${selectedCard.color} p-4 text-white`} id="s1-card-preview">
                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">{selectedCard.type ?? 'Credit Card'} · {selectedCard.brand}</p>
                    <p className="text-sm font-bold mb-2">{selectedCard.name}</p>
                    <p className="font-mono tracking-[.2em] text-sm mb-3">{selectedCard.maskedNumber}</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Holder</p>
                        <p className="font-semibold">{selectedCard.holder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest">Expires</p>
                        <p className="font-semibold">{selectedCard.expiry}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CVV — only manual entry required */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-widest" htmlFor="inp-cvv">
                    CVV (3-digit security code on back of card) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inp-cvv" type="password" placeholder="Enter CVV" value={cvv}
                    onChange={e => { setCvv(e.target.value.replace(/\D/g,'').slice(0,4)); setCardErrors(p=>({...p,cvv:''})) }}
                    maxLength={4}
                    className={cardErrors.cvv ? 'border-red-500' : ''}
                    disabled={!selectedCardId}
                  />
                  {cardErrors.cvv && <p className="text-xs text-red-500" id="err-cvv">{cardErrors.cvv}</p>}
                </div>

                {/* Demo hint — CVV only since number/expiry are auto-filled */}
                {selectedCard && (
                  <div className="rounded-lg bg-muted/50 border border-dashed p-3" id="demo-hint">
                    <button type="button" className="text-xs text-blue-600 font-semibold hover:underline"
                      onClick={() => setShowHint(p=>!p)} id="btn-toggle-hint">
                      {showHint ? '▾ Hide demo CVV' : '▸ Show demo CVV (testing)'}
                    </button>
                    {showHint && (
                      <div className="text-xs font-mono mt-2 space-y-0.5 text-muted-foreground">
                        <p>CVV: <span className="text-foreground font-bold">{selectedCard.demoCvv}</span></p>
                        {selectedCard.cardStatus !== 'Active' && (
                          <p className="text-amber-600 font-semibold mt-1">⚠ Card is {selectedCard.cardStatus} — AC6 rejection will be triggered.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog} id="btn-s1-cancel">Cancel</Button>
                <Button onClick={handleVerifyCard} id="btn-s1-verify">
                  Verify Card <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── STEP 2: Request Amount (AC2, AC3) ─────────────────────── */}
          {step === 2 && selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Request Credit Limit Increase</DialogTitle>
                <DialogDescription>Review your card details and enter the increase amount. (AC2 & AC3)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2" id="step2-form">

                {/* Card visual */}
                <div className={`rounded-xl bg-gradient-to-br ${selectedCard.color} p-4 text-white`} id="s2-card-visual">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest">Credit Card</p>
                      <p className="text-sm font-bold">{selectedCard.name}</p>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">{selectedCard.brand}</Badge>
                  </div>
                  <p className="font-mono tracking-[.2em] text-base mb-3">{selectedCard.maskedNumber}</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-white/60 uppercase tracking-widest text-[10px]">Current Limit</p>
                      <p className="font-bold mt-0.5">{formatCurrency(selectedCard.limit)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 uppercase tracking-widest text-[10px]">Available</p>
                      <p className="font-bold mt-0.5">{formatCurrency(selectedCard.limit - selectedCard.used)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 uppercase tracking-widest text-[10px]">Outstanding</p>
                      <p className="font-bold mt-0.5">{formatCurrency(selectedCard.used)}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-white/70">
                      <span>Utilization</span>
                      <span>{Math.round((selectedCard.used / selectedCard.limit) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full"
                        style={{ width: `${Math.round((selectedCard.used / selectedCard.limit) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-widest" htmlFor="inp-amount">
                    Requested Increase Amount (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inp-amount" type="number" min={MIN_INCREASE} max={MAX_INCREASE}
                    placeholder="e.g. 50000"
                    value={increaseAmount}
                    onChange={e => { setIncreaseAmount(e.target.value); setAmountError('') }}
                    className={amountError ? 'border-red-500' : ''}
                  />
                  {amountError
                    ? <p className="text-xs text-red-500" id="err-amount">{amountError}</p>
                    : <p className="text-xs text-muted-foreground">
                        Min: {formatCurrency(MIN_INCREASE)} · Max: {formatCurrency(MAX_INCREASE)} · Bank cap: {formatCurrency(BANK_MAX_LIMIT)}
                      </p>
                  }
                </div>

                {/* Live preview */}
                {increaseAmount && !isNaN(parseFloat(increaseAmount)) && parseFloat(increaseAmount) > 0 && (
                  <div className="rounded-lg bg-muted/50 border p-3 flex justify-between items-center text-sm" id="new-limit-preview">
                    <span className="text-muted-foreground font-medium">New Credit Limit would be</span>
                    <span className="font-bold text-primary text-base">
                      {formatCurrency(selectedCard.limit + parseFloat(increaseAmount))}
                    </span>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep(1)} id="btn-s2-back">← Back</Button>
                <Button onClick={handleSubmitRequest} id="btn-s2-submit">
                  Submit Request <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── STEP 3: Compliance Processing (AC4–AC10) ─────────────── */}
          {step === 3 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {!processingDone
                    ? 'Running Compliance Checks…'
                    : overallResult === 'fail'         ? 'Request Rejected'
                    : overallResult === 'otp_required' ? 'Verification Required'
                    :                                    'All Checks Passed ✓'}
                </DialogTitle>
                <DialogDescription>
                  {!processingDone
                    ? 'Please wait — validating your request against AC4–AC10 checks.'
                    : overallResult === 'fail'         ? 'One or more checks did not pass.'
                    : overallResult === 'otp_required' ? 'OTP required to complete your request.'
                    :                                    'Your request is ready to be submitted.'}
                </DialogDescription>
              </DialogHeader>

              <div className="py-2 space-y-3" id="step3-checks">
                <Progress value={progressPct} className="h-2" id="compliance-progress" />
                <p className="text-xs text-muted-foreground text-right">{progressPct}% complete</p>

                <div className="space-y-1.5" id="check-list">
                  {CHECKS.map((check, i) => {
                    const result   = checkResults[check.id]
                    const isActive = processingIndex === i && !result
                    const Icon     = check.icon

                    let statusIcon = <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/25" />
                    if (isActive)               statusIcon = <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    else if (result?.status === 'pass') statusIcon = <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    else if (result?.status === 'warn') statusIcon = <AlertTriangle className="h-4 w-4 text-amber-500" />
                    else if (result?.status === 'fail') statusIcon = <XCircle className="h-4 w-4 text-red-500" />

                    return (
                      <div key={check.id} id={`check-${check.id}`}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors
                          ${isActive             ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                          : result?.status==='fail' ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                          : result?.status==='warn' ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                          : result?.status==='pass' ? 'bg-muted/30' : ''}`}>
                        <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className={`h-3.5 w-3.5 ${
                            isActive ? 'text-blue-500'
                            : result?.status==='pass' ? 'text-emerald-500'
                            : result?.status==='warn' ? 'text-amber-500'
                            : result?.status==='fail' ? 'text-red-500'
                            : 'text-muted-foreground/40'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-none mb-0.5
                            ${result?.status==='fail' ? 'text-red-600 dark:text-red-400'
                            : result?.status==='warn' ? 'text-amber-700 dark:text-amber-300'
                            : 'text-foreground'}`}>{check.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {result ? result.message : isActive ? 'Checking…' : check.desc}
                          </p>
                        </div>
                        <div className="flex-shrink-0 mt-0.5">{statusIcon}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Audit timestamp shown after completion */}
                {processingDone && (
                  <div className="rounded-lg bg-muted/50 border p-3 text-xs font-mono text-muted-foreground space-y-0.5" id="audit-info">
                    <p>Timestamp:   {new Date().toISOString()}</p>
                    <p>Customer ID: {CUSTOMER.customerId} · CIF: {CUSTOMER.cifNumber}</p>
                    <p>Session:     {CUSTOMER.accountId} · IP: 192.168.xxx.xxx</p>
                  </div>
                )}
              </div>

              {processingDone && (
                <DialogFooter>
                  {overallResult === 'fail'
                    ? <Button variant="outline" onClick={closeDialog} id="btn-s3-close">Close</Button>
                    : <Button onClick={handleNextFromProcessing} id="btn-s3-continue"
                        className={overallResult === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                        {overallResult === 'otp_required'
                          ? <>Verify OTP <ArrowRight className="h-4 w-4 ml-2" /></>
                          : <>Confirm Request <ArrowRight className="h-4 w-4 ml-2" /></>}
                      </Button>
                  }
                </DialogFooter>
              )}
            </>
          )}

          {/* ── STEP 4: OTP Verification (AC8 Medium Risk) ───────────── */}
          {step === 4 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">OTP Verification</DialogTitle>
                <DialogDescription>
                  Medium fraud risk detected. Enter the 6-digit OTP sent to your registered mobile ••••7890. (AC8)
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 flex flex-col items-center gap-4" id="step4-otp">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-amber-600" />
                </div>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} id="otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">Enter any 6 digits for this demo</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep(3)} id="btn-s4-back">← Back</Button>
                <Button onClick={handleVerifyOtp} disabled={otpVerifying} id="btn-s4-verify">
                  {otpVerifying
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
                    : <>Verify & Submit <ArrowRight className="h-4 w-4 ml-2" /></>}
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── STEP 5: Result ────────────────────────────────────────── */}
          {step === 5 && (
            overallResult === 'fail' ? (
              /* Rejection */
              <div className="py-8 text-center space-y-4" id="step5-rejected">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Request Rejected</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">{failReason}</p>
                <div className="rounded-lg bg-muted/50 border p-3 text-xs font-mono text-muted-foreground">
                  <p>Timestamp: {new Date().toISOString()}</p>
                  <p>Customer: {CUSTOMER.customerId}</p>
                </div>
                <Button variant="outline" onClick={closeDialog} id="btn-s5-close-rejected">Close</Button>
              </div>
            ) : (
              /* Success */
              <div className="py-6 text-center space-y-4" id="step5-success">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Request Submitted!</h3>
                <p className="text-sm text-muted-foreground">
                  Your request is pending review. You will be notified within 2–3 business days.
                </p>
                {submittedReq && (
                  <div className="rounded-lg bg-muted/50 border p-4 text-sm text-left space-y-2" id="s5-summary">
                    {[
                      ['Request ID',          <span className="font-mono font-bold text-primary">{submittedReq.id}</span>],
                      ['Card',                <span className="font-mono text-xs">{submittedReq.cardMasked}</span>],
                      ['Increase Requested',  <span className="font-bold text-emerald-600">+{formatCurrency(submittedReq.increaseAmount)}</span>],
                      ['New Limit (Pending)', <span className="font-bold">{formatCurrency(submittedReq.newLimit)}</span>],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>{v}
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className={STATUS_BADGE['Pending']}>Pending Review</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submitted At</span>
                      <span className="text-xs font-mono">{new Date(submittedReq.requestDate).toISOString()}</span>
                    </div>
                  </div>
                )}
                <Button onClick={closeDialog} id="btn-s5-done" className="bg-emerald-600 hover:bg-emerald-700">Done</Button>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
