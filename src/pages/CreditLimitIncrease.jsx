import { Component, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import {
  CreditCard, TrendingUp, CheckCircle2, XCircle, Clock, Shield,
  AlertTriangle, Loader2, ArrowRight, ChevronRight, Info, Lock,
  FileCheck, Fingerprint, BadgeCheck, Search, Home, Check,
  RotateCcw, ArrowUpCircle, Sparkles, Eye, EyeOff, Banknote,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Policy ────────────────────────────────────────────────────────────────
const MIN_CREDIT_SCORE = 750
const MAX_UTILIZATION  = 80
const BANK_MAX_LIMIT   = 3000000
const CARD_MAX         = { 1: 500000, 2: 800000 }  // per-card max allowed

// ─── Mock customer ──────────────────────────────────────────────────────────
const CUSTOMER = {
  customerId:       'CUST-7821',
  cifNumber:        'CIF-089123',
  accountId:        'ACC-001',
  name:             'Rajesh Kumar',
  creditScore:      772,
  utilizationRatio: 45,
  kycStatus:        'Verified',
  kycExpiry:        '2027-12-31',
  amlStatus:        'Clear',
  fraudRiskScore:   18,
  riskLevel:        'LOW',
}

// ─── Mock credit cards ──────────────────────────────────────────────────────
const CREDIT_CARDS = [
  {
    id: 1,
    name:         'SecureBank Rewards Credit',
    maskedNumber: '**** **** **** 8765',
    fullNumber:   '5425233430108765',
    lastFour:     '8765',
    holder:       'RAJESH KUMAR',
    expiry:       '12/27',
    cvv:          '456',
    brand:        'Mastercard',
    cardStatus:   'Active',
    accountStatus:'Active',
    limit:        300000,
    used:         125000,
    color:        'from-blue-700 to-indigo-800',
  },
  {
    id: 2,
    name:         'SecureBank Business Credit',
    maskedNumber: '**** **** **** 3456',
    fullNumber:   '4916338506083456',
    lastFour:     '3456',
    holder:       'RAJESH KUMAR',
    expiry:       '06/29',
    cvv:          '789',
    brand:        'Visa',
    cardStatus:   'Active',
    accountStatus:'Active',
    limit:        500000,
    used:         230000,
    color:        'from-violet-700 to-purple-800',
  },
]

// ─── Initial history ────────────────────────────────────────────────────────
const INITIAL_REQUESTS = [
  {
    id: 'CLR-2025-001', cardMasked: '**** **** **** 8765', cardName: 'SecureBank Rewards Credit',
    currentLimit: 300000, newLimit: 500000,
    creditScore: 700, status: 'Approved',
    requestDate: '2025-12-15T10:30:45Z', approvalDate: '2025-12-16T14:05:12Z', rejectionReason: null,
  },
  {
    id: 'CLR-2026-001', cardMasked: '**** **** **** 8765', cardName: 'SecureBank Rewards Credit',
    currentLimit: 500000, newLimit: 3000000,
    creditScore: 720, status: 'Rejected',
    requestDate: '2026-03-20T09:15:33Z', approvalDate: null,
    rejectionReason: 'Requested credit limit exceeds the allowable maximum of ₹30,00,000',
  },
]

// ─── Compliance checks ──────────────────────────────────────────────────────
const CHECKS = [
  { id: 'credit_score',       icon: TrendingUp,  label: 'Credit Score Eligibility', desc: `Min score required: ${MIN_CREDIT_SCORE}` },
  { id: 'card_account',       icon: CreditCard,  label: 'Card & Account Status',    desc: 'Confirming active status' },
  { id: 'amount_eligibility', icon: Banknote,    label: 'Amount Eligibility',       desc: 'Validating requested amount' },
  { id: 'utilization',        icon: FileCheck,   label: 'Credit Utilization',       desc: 'Max allowed: 80%' },
  { id: 'kyc',                icon: BadgeCheck,  label: 'KYC Verification',         desc: 'Identity documents check' },
  { id: 'fraud',              icon: Fingerprint, label: 'Fraud Risk Assessment',    desc: 'Device & velocity checks' },
  { id: 'aml',                icon: Search,      label: 'AML & Sanctions',          desc: 'Anti-money laundering' },
]

function evaluateCheck(checkId, card, desired) {
  switch (checkId) {
    case 'credit_score':
      if (CUSTOMER.creditScore < MIN_CREDIT_SCORE)
        return { status: 'fail', message: `Score ${CUSTOMER.creditScore} is below minimum ${MIN_CREDIT_SCORE}` }
      return { status: 'pass', message: `Score: ${CUSTOMER.creditScore} — Eligible` }
    case 'card_account':
      if (card.accountStatus !== 'Active')
        return { status: 'fail', message: `Account status: ${card.accountStatus}. Not eligible.` }
      if (card.cardStatus !== 'Active')
        return { status: 'fail', message: `Card status: ${card.cardStatus}. Not eligible.` }
      return { status: 'pass', message: 'Card: Active · Account: Active' }
    case 'amount_eligibility': {
      const cardMax = CARD_MAX[card.id] ?? BANK_MAX_LIMIT
      if (!desired || desired <= card.limit)
        return { status: 'fail', message: 'Requested amount must be greater than current limit.' }
      if (desired > cardMax)
        return { status: 'fail', message: `₹${fmt(desired)} exceeds max allowed ₹${fmt(cardMax)} for this card.` }
      const ratio = (desired - card.limit) / card.limit
      if (ratio > 1)
        return { status: 'warn', message: `Large increase (${Math.round(ratio * 100)}% above current) — OTP required.` }
      return { status: 'pass', message: `₹${fmt(desired)} is within eligible range for this card.` }
    }
    case 'utilization':
      if (CUSTOMER.utilizationRatio > MAX_UTILIZATION)
        return { status: 'fail', message: `Utilization: ${CUSTOMER.utilizationRatio}% exceeds ${MAX_UTILIZATION}% limit.` }
      return { status: 'pass', message: `Utilization: ${CUSTOMER.utilizationRatio}% — Within limit` }
    case 'kyc':
      if (CUSTOMER.kycStatus !== 'Verified')
        return { status: 'fail', message: 'KYC verification must be completed first.' }
      return { status: 'pass', message: `KYC: ${CUSTOMER.kycStatus} · Expires: ${CUSTOMER.kycExpiry}` }
    case 'fraud':
      if (CUSTOMER.riskLevel === 'HIGH')
        return { status: 'fail', message: 'Request blocked due to security concerns.' }
      if (CUSTOMER.riskLevel === 'MEDIUM')
        return { status: 'warn', message: 'Additional OTP verification required.' }
      return { status: 'pass', message: `Risk score: ${CUSTOMER.fraudRiskScore}/100 — LOW` }
    case 'aml':
      if (CUSTOMER.amlStatus !== 'Clear')
        return { status: 'fail', message: 'AML check failed. Request blocked.' }
      return { status: 'pass', message: 'AML: Clear · No sanctions match' }
    default:
      return { status: 'pass', message: 'Check passed' }
  }
}

function genRequestId() {
  return `CLR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000 + 1000))}`
}
function genSRN() {
  return `SR${Date.now().toString().slice(-9)}`
}

const STATUS_BADGE = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:  'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
}

function ScoreBadge({ score }) {
  const pct = Math.round(((score - 300) / 600) * 100)
  const color =
    score >= 800 ? 'text-emerald-300' :
    score >= 750 ? 'text-green-300' :
    score >= 700 ? 'text-yellow-300' :
    score >= 650 ? 'text-orange-300' : 'text-red-300'
  const label =
    score >= 800 ? 'Excellent' :
    score >= 750 ? 'Good' :
    score >= 700 ? 'Fair' :
    score >= 650 ? 'Below Avg' : 'Poor'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center h-16 w-16 rounded-full border-4 border-white/20 bg-white/10">
        <span className={`text-xl font-black ${color}`}>{score}</span>
      </div>
      <span className={`text-xs font-bold ${color}`}>{label}</span>
      <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full rounded-full bg-white/70" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

const fmt = (n) => (typeof n === 'number' && isFinite(n) ? n : 0).toLocaleString('en-IN')

class CLIErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center space-y-3">
          <p className="text-lg font-bold text-destructive">Something went wrong</p>
          <p className="text-sm text-muted-foreground font-mono">{this.state.error.message}</p>
          <button className="text-xs text-blue-600 underline" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

// ══════════════════════════════════════════════════════════════════════════════
function CreditLimitIncreaseInner() {
  const navigate = useNavigate()
  const [requests, setRequests]     = useState(INITIAL_REQUESTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [step, setStep]             = useState(1)

  // Step 1 — manual card entry
  const [manualNum, setManualNum]   = useState('')
  const [manualExp, setManualExp]   = useState('')
  const [manualCvv, setManualCvv]   = useState('')
  const [showNum, setShowNum]       = useState(false)
  const [cardError, setCardError]   = useState('')
  const [matchedCard, setMatchedCard] = useState(null)

  // Step 2
  const [desiredLimit, setDesiredLimit] = useState(0)
  const [limitInput, setLimitInput]     = useState('')
  const [limitError, setLimitError]     = useState('')

  // Step 3
  const [processingIndex, setProcessingIndex] = useState(-1)
  const [checkResults, setCheckResults]       = useState({})
  const [processingDone, setProcessingDone]   = useState(false)
  const [overallResult, setOverallResult]     = useState(null)

  // Step 4
  const [otp, setOtp]                   = useState('')
  const [otpVerifying, setOtpVerifying] = useState(false)

  // Step 5
  const [submittedReq, setSubmittedReq] = useState(null)
  const [submittedAt, setSubmittedAt]   = useState(null)
  const [srnNumber, setSrnNumber]       = useState('')

  const openDialog = () => { resetWizard(); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setTimeout(resetWizard, 300) }

  const resetWizard = () => {
    setStep(1)
    setManualNum(''); setManualExp(''); setManualCvv(''); setShowNum(false); setCardError(''); setMatchedCard(null)
    setDesiredLimit(0); setLimitInput(''); setLimitError('')
    setProcessingIndex(-1); setCheckResults({}); setProcessingDone(false); setOverallResult(null)
    setOtp(''); setOtpVerifying(false)
    setSubmittedReq(null); setSubmittedAt(null); setSrnNumber('')
  }

  // ── Step 1 → Step 2 ────────────────────────────────────────────────────────
  const handleProceedCard = () => {
    if (manualNum.length !== 16) { setCardError('Please enter a valid 16-digit card number'); return }
    if (!/^\d{2}\/\d{2}$/.test(manualExp)) { setCardError('Please enter a valid expiry date (MM/YY)'); return }
    if (manualCvv.length < 3) { setCardError('Please enter a valid CVV'); return }
    const card = CREDIT_CARDS.find(c =>
      c.fullNumber.slice(-4) === manualNum.slice(-4) &&
      c.cvv === manualCvv &&
      c.expiry === manualExp
    )
    if (!card) { setCardError('Card details do not match our records. Please check and try again.'); return }
    setCardError('')
    setMatchedCard(card)
    setDesiredLimit(card.limit)
    setLimitInput(String(card.limit))
    setStep(2)
  }

  // ── Step 2 → Step 3 ────────────────────────────────────────────────────────
  const handleProceedLimit = () => {
    const cardMax = CARD_MAX[matchedCard?.id] ?? BANK_MAX_LIMIT
    if (!desiredLimit || desiredLimit <= (matchedCard?.limit ?? 0)) {
      setLimitError('Please select a limit higher than your current limit.')
      return
    }
    if (desiredLimit > cardMax) {
      setLimitError(`Maximum allowed limit for this card is ₹${fmt(cardMax)}.`)
      return
    }
    setLimitError('')
    const card = matchedCard
    setStep(3)
    setTimeout(() => runChecks(card, desiredLimit), 120)
  }

  const handleResetLimit = () => {
    if (matchedCard) {
      setDesiredLimit(matchedCard.limit)
      setLimitInput(String(matchedCard.limit))
      setLimitError('')
    }
  }

  const handleSliderChange = (v) => {
    const val = Array.isArray(v) ? v[0] : (typeof v === 'number' ? v : matchedCard?.limit)
    if (typeof val !== 'number' || val < (matchedCard?.limit ?? 0)) return
    setDesiredLimit(val)
    setLimitInput(String(val))
    setLimitError('')
  }

  const handleLimitInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setLimitInput(raw)
    const num = raw ? parseInt(raw, 10) : NaN
    if (!isNaN(num) && matchedCard) {
      const cardMax = CARD_MAX[matchedCard.id] ?? BANK_MAX_LIMIT
      setDesiredLimit(Math.min(Math.max(num, matchedCard.limit), cardMax))
    }
    setLimitError('')
  }

  // ── Step 3 ──────────────────────────────────────────────────────────────────
  const runChecks = async (card, desired) => {
    const results = {}
    for (let i = 0; i < CHECKS.length; i++) {
      setProcessingIndex(i)
      await new Promise(r => setTimeout(r, 480 + Math.random() * 380))
      const result = evaluateCheck(CHECKS[i].id, card, desired)
      results[CHECKS[i].id] = result
      setCheckResults(prev => ({ ...prev, [CHECKS[i].id]: result }))
      if (result.status === 'fail') {
        setProcessingDone(true); setOverallResult('fail'); return
      }
    }
    setProcessingIndex(CHECKS.length)
    setProcessingDone(true)
    setOverallResult(Object.values(results).some(r => r.status === 'warn') ? 'otp_required' : 'pass')
  }

  const handleNextFromProcessing = () => {
    if (overallResult === 'pass')              { setSubmittedAt(new Date()); finalizeRequest() }
    else if (overallResult === 'otp_required') { setStep(4) }
    else                                        { setStep(5) }
  }

  // ── Step 4 ──────────────────────────────────────────────────────────────────
  const handleVerifyOtp = () => {
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP.'); return }
    setOtpVerifying(true)
    setTimeout(() => { setOtpVerifying(false); setSubmittedAt(new Date()); finalizeRequest() }, 1500)
  }

  // ── Finalize ─────────────────────────────────────────────────────────────────
  const finalizeRequest = () => {
    const now = new Date()
    const newReq = {
      id:           genRequestId(),
      cardMasked:   matchedCard.maskedNumber,
      cardName:     matchedCard.name,
      currentLimit: matchedCard.limit,
      newLimit:     desiredLimit,
      creditScore:  CUSTOMER.creditScore,
      status:       'Pending',
      requestDate:  now.toISOString(),
      approvalDate: null,
      rejectionReason: null,
    }
    setSubmittedReq(newReq)
    setRequests(prev => [newReq, ...prev])
    const stored = JSON.parse(localStorage.getItem('clr_pending_requests') || '[]')
    localStorage.setItem('clr_pending_requests', JSON.stringify([newReq, ...stored]))
    setStep(5)
    toast.success(`Request ${newReq.id} submitted successfully.`)
  }

  const approved = requests.filter(r => r.status === 'Approved').length
  const pending  = requests.filter(r => r.status === 'Pending').length
  const rejected = requests.filter(r => r.status === 'Rejected').length

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-fade-in" id="credit-limit-page">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <CreditCard className="h-3.5 w-3.5" />
        <span>Cards</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">Credit Limit Increase</span>
      </div>

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Exclusive Offer</span>
            </div>
            <h2 className="text-3xl font-black leading-tight">
              Enjoy shopping with a<br />higher Credit Limit
            </h2>
            <p className="text-blue-200 text-sm max-w-md">
              Get instant access to more spending power. Apply now and get a decision within minutes.
            </p>
            <Button onClick={openDialog} id="btn-new-request" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg mt-2">
              <TrendingUp className="h-4 w-4 mr-2" />Apply for Limit Increase
            </Button>
          </div>
          <div className="flex flex-col items-center gap-1 bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20 min-w-[160px]">
            <ScoreBadge score={CUSTOMER.creditScore} />
            <p className="text-xs text-blue-200 font-semibold mt-1">Your Credit Score</p>
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
              CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'
            }`}>
              {CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'Eligible' : `Min required: ${MIN_CREDIT_SCORE}`}
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Services ─────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Card Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Avail New Card',        desc: 'Choose additional cards to get more benefits',       color: 'from-blue-50 to-cyan-50',     border: 'border-blue-100',   icon: CreditCard, iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   action: () => navigate('/cards') },
            { title: 'Credit Limit Increase', desc: 'Exclusive offer! Increase your Credit Limit now',   color: 'from-pink-50 to-rose-50',     border: 'border-pink-100',   icon: TrendingUp, iconBg: 'bg-pink-100',   iconColor: 'text-pink-600',   action: openDialog },
            { title: 'Card Protection Plan',  desc: 'Enjoy exclusive benefits with CPP Card protection plan', color: 'from-purple-50 to-violet-50', border: 'border-purple-100', icon: Shield,     iconBg: 'bg-purple-100', iconColor: 'text-purple-600', action: () => toast.info('Card Protection Plan — Coming soon') },
          ].map((item) => (
            <button key={item.title} onClick={item.action}
              className={`relative text-left rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} p-5 flex items-center gap-4 hover:shadow-md transition-all group`}>
              <div className={`h-14 w-14 rounded-2xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`h-7 w-7 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform`}>
                <ArrowRight className={`h-4 w-4 ${item.iconColor}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: requests.length, icon: FileCheck,    color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Approved',       value: approved,        icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Review', value: pending,         icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Rejected',       value: rejected,        icon: XCircle,      color: 'text-red-600',     bg: 'bg-red-50' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border shadow-sm">
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

      {/* ── Policy note ────────────────────────────────────────────────────── */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>Bank Policy —</strong>&nbsp;
          Credit Limit Increase is subject to internal assessment policies and is at the absolute discretion of SecureBank.
          Minimum credit score required: <strong>{MIN_CREDIT_SCORE}</strong>. Your score:&nbsp;
          <strong className={CUSTOMER.creditScore >= MIN_CREDIT_SCORE ? 'text-emerald-600' : 'text-red-600'}>{CUSTOMER.creditScore}</strong>.
        </AlertDescription>
      </Alert>

      {/* ── Request History ────────────────────────────────────────────────── */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold">Request History</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">All credit limit increase requests for your account</p>
          </div>
          <Badge variant="outline">{requests.length} request{requests.length !== 1 ? 's' : ''}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No requests yet. Click <strong>Apply for Limit Increase</strong> to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6 text-xs uppercase tracking-wider font-bold">Request ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Card</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">Current Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-right">New Limit</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center">Score</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-bold text-center pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-mono text-xs font-bold text-primary">{req.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-[160px]">{req.cardName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{req.cardMasked}</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatCurrency(req.currentLimit)}</TableCell>
                    <TableCell className="text-right font-bold text-sm text-emerald-600">{formatCurrency(req.newLimit)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-bold ${req.creditScore >= MIN_CREDIT_SCORE ? 'text-emerald-600' : 'text-red-500'}`}>{req.creditScore}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(req.requestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Badge variant="outline" className={STATUS_BADGE[req.status] || ''}>{req.status}</Badge>
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

      {/* ══════════════════════════════════════════════════════════════════════
          WIZARD DIALOG
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent
          className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-0"
          onPointerDownOutside={e => { if (step === 3 && !processingDone) e.preventDefault() }}
        >

          {/* ── STEP 1: Manual card entry ──────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-t-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ArrowUpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">Credit Limit Increase</p>
                    <p className="text-blue-200 text-xs mt-0.5">Enter your credit card details to continue</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white/10 rounded-xl py-2 px-6 text-center">
                    <p className="text-base font-black text-white">₹3L – ₹8L</p>
                    <p className="text-[10px] text-blue-200 mt-0.5 leading-tight">Max Limit (per card)</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Enter Credit Card Details</p>

                {/* Card number */}
                <div className="space-y-1.5">
                  <Label htmlFor="clr-num" className="text-xs font-semibold">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="clr-num"
                      className={`pl-9 pr-10 font-mono tracking-widest text-sm ${cardError ? 'border-red-400' : ''}`}
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="•••• •••• •••• ••••"
                      value={(() => {
                        if (!manualNum.length) return ''
                        if (showNum) return manualNum.match(/.{1,4}/g)?.join(' ') ?? manualNum
                        return ('•'.repeat(manualNum.length)).match(/.{1,4}/g)?.join(' ') ?? ''
                      })()}
                      onPaste={e => {
                        e.preventDefault()
                        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 16)
                        if (digits) { setManualNum(digits); setShowNum(false); setCardError('') }
                      }}
                      onChange={e => {
                        if (showNum) {
                          setManualNum(e.target.value.replace(/\D/g, '').slice(0, 16))
                        } else {
                          const oldLen = manualNum.length
                          const newMeaningful = e.target.value.replace(/\s/g, '')
                          const newLen = newMeaningful.length
                          if (newLen > oldLen && oldLen < 16) {
                            const digit = e.target.value.replace(/[•\s]/g, '').slice(-1)
                            if (/\d/.test(digit)) setManualNum(p => (p + digit).slice(0, 16))
                          } else if (newLen < oldLen) {
                            setManualNum(p => p.slice(0, newLen))
                          }
                        }
                        setCardError('')
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNum(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNum ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="clr-exp" className="text-xs font-semibold">Expiry Date</Label>
                    <Input
                      id="clr-exp"
                      className={`font-mono text-sm ${cardError ? 'border-red-400' : ''}`}
                      placeholder="MM/YY"
                      maxLength={5}
                      value={manualExp}
                      onChange={e => {
                        let v = e.target.value.replace(/[^\d/]/g, '')
                        if (v.length === 2 && manualExp.length === 1) v = v + '/'
                        setManualExp(v.slice(0, 5))
                        setCardError('')
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clr-cvv" className="text-xs font-semibold">CVV</Label>
                    <Input
                      id="clr-cvv"
                      type="password"
                      className={`font-mono text-sm ${cardError ? 'border-red-400' : ''}`}
                      placeholder="•••"
                      maxLength={4}
                      value={manualCvv}
                      onPaste={e => {
                        e.preventDefault()
                        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
                        if (digits) { setManualCvv(digits); setCardError('') }
                      }}
                      onChange={e => {
                        setManualCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                        setCardError('')
                      }}
                    />
                  </div>
                </div>

                {cardError && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 flex-shrink-0" />{cardError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={closeDialog} className="flex-1">Cancel</Button>
                  <Button onClick={handleProceedCard} className="flex-1" id="btn-s1-proceed">
                    Proceed <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Desired limit slider ────────────────────────────────── */}
          {step === 2 && matchedCard && (() => {
            const cardMax = CARD_MAX[matchedCard.id] ?? BANK_MAX_LIMIT
            const sliderVal = Math.min(Math.max(desiredLimit, matchedCard.limit), cardMax)
            return (
              <>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-t-lg p-6 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <div className="rounded-lg bg-white border px-3 py-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Card</p>
                      <p className="text-sm font-black">{matchedCard.name.replace('SecureBank ', '')}</p>
                    </div>
                    <div className="rounded-lg bg-white border px-3 py-2 text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Credit Limit</p>
                      <p className="text-sm font-black text-blue-600">₹{fmt(matchedCard.limit)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground">Please select your desired Credit Limit</p>
                    <p className="text-4xl font-black text-foreground tracking-tight">
                      ₹{Number(limitInput || matchedCard.limit).toLocaleString('en-IN')}
                    </p>
                    {desiredLimit > matchedCard.limit && (
                      <p className="text-xs font-semibold text-emerald-600">
                        +₹{fmt(desiredLimit - matchedCard.limit)} increase
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Slider
                      min={matchedCard.limit} max={cardMax} step={10000}
                      value={[sliderVal]}
                      onValueChange={handleSliderChange}
                      className="w-full" id="limit-slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>Current ₹{fmt(matchedCard.limit)}</span>
                      <span>Max ₹{fmt(cardMax)}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-widest">Enter Desired Limit</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">₹</span>
                      <Input
                        id="limit-input"
                        className={`pl-7 text-sm font-semibold ${limitError ? 'border-red-500' : ''}`}
                        value={limitInput}
                        onChange={handleLimitInputChange}
                        placeholder="e.g. 4,00,000"
                      />
                    </div>
                    {limitError && <p className="text-xs text-red-500">{limitError}</p>}
                  </div>
                  <div className="rounded-xl bg-muted/50 border p-3 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Credit Limit Increase is subject to SecureBank internal policies and at the absolute discretion of SecureBank.
                      Minimum credit score required is <strong>{MIN_CREDIT_SCORE}</strong>.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleResetLimit} id="btn-reset" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />Reset
                    </Button>
                    <Button onClick={handleProceedLimit} id="btn-proceed" className="flex-1">
                      Proceed <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}

          {/* ── STEP 3: Compliance checks ────────────────────────────────────── */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {!processingDone
                    ? 'Processing your request…'
                    : overallResult === 'fail'         ? 'Request Could Not Be Processed'
                    : overallResult === 'otp_required' ? 'Verification Required'
                    :                                    'All Checks Passed ✓'}
                </DialogTitle>
                <DialogDescription>
                  {!processingDone ? 'Please wait while we verify your eligibility.' : ''}
                </DialogDescription>
              </DialogHeader>

              {/* Step-circle progress */}
              <div className="flex items-center justify-between px-1 py-2">
                {CHECKS.map((chk, i) => {
                  const res      = checkResults[chk.id]
                  const isActive = processingIndex === i && !res
                  const isPast   = !!res
                  const isFail   = res?.status === 'fail'
                  const isWarn   = res?.status === 'warn'
                  return (
                    <div key={chk.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                          ${isFail   ? 'bg-red-500 border-red-500 text-white'
                          : isWarn   ? 'bg-amber-500 border-amber-500 text-white'
                          : isPast   ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm shadow-blue-200'
                          :            'bg-muted border-muted-foreground/25 text-muted-foreground/50'}`}
                        >
                          {isFail    ? <XCircle className="h-4 w-4" />
                          : isWarn   ? <AlertTriangle className="h-3.5 w-3.5" />
                          : isPast   ? <Check className="h-4 w-4" />
                          : isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : i + 1}
                        </div>
                        <span className="text-[9px] font-semibold text-center leading-tight max-w-[52px] truncate text-muted-foreground">
                          {chk.label.split(' ')[0]}
                        </span>
                      </div>
                      {i < CHECKS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-colors ${isPast ? 'bg-emerald-400' : 'bg-muted'}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="space-y-1.5">
                {CHECKS.map((check, i) => {
                  const result   = checkResults[check.id]
                  const isActive = processingIndex === i && !result
                  const Icon     = check.icon
                  let statusIcon = <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/25" />
                  if (isActive)                      statusIcon = <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  else if (result?.status === 'pass') statusIcon = <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  else if (result?.status === 'warn') statusIcon = <AlertTriangle className="h-4 w-4 text-amber-500" />
                  else if (result?.status === 'fail') statusIcon = <XCircle className="h-4 w-4 text-red-500" />
                  return (
                    <div key={check.id}
                      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors
                        ${isActive              ? 'bg-blue-50 border border-blue-200'
                        : result?.status==='fail' ? 'bg-red-50 border border-red-200'
                        : result?.status==='warn' ? 'bg-amber-50 border border-amber-200'
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
                          ${result?.status==='fail' ? 'text-red-600' : result?.status==='warn' ? 'text-amber-700' : 'text-foreground'}`}>
                          {check.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result ? result.message : isActive ? 'Checking…' : check.desc}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">{statusIcon}</div>
                    </div>
                  )
                })}
              </div>

              {processingDone && (
                <div className="pt-2">
                  {overallResult === 'fail'
                    ? <Button variant="outline" onClick={closeDialog} className="w-full">Close</Button>
                    : <Button onClick={handleNextFromProcessing} className={`w-full ${overallResult === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
                        {overallResult === 'otp_required'
                          ? <>Verify OTP <ArrowRight className="h-4 w-4 ml-2" /></>
                          : <>Confirm Request <ArrowRight className="h-4 w-4 ml-2" /></>}
                      </Button>
                  }
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: OTP ──────────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="p-6 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">OTP Verification</DialogTitle>
                <DialogDescription>
                  Additional verification required. Enter the 6-digit OTP sent to ••••7890.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
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
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">← Back</Button>
                <Button onClick={handleVerifyOtp} disabled={otpVerifying} className="flex-1" id="btn-verify-otp">
                  {otpVerifying
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
                    : <>Verify & Submit <ArrowRight className="h-4 w-4 ml-2" /></>}
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Success ───────────────────────────────────────────────── */}
          {step === 5 && (
            <div className="p-8 text-center space-y-5" id="success-screen">
              <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Request Submitted!</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Your credit limit increase request is under review. You will be notified within 2–3 business days.
                </p>
              </div>

              {submittedReq && (
                <div className="rounded-xl bg-muted/50 border p-4 text-sm text-left space-y-2.5 max-w-xs mx-auto">
                  {[
                    ['Request ID',      <span className="font-mono font-bold text-primary text-xs">{submittedReq.id}</span>],
                    ['Card',            <span className="font-mono text-xs">{submittedReq.cardMasked}</span>],
                    ['Current Limit',   <span className="font-semibold">{formatCurrency(submittedReq.currentLimit)}</span>],
                    ['Requested Limit', <span className="font-bold text-emerald-600">{formatCurrency(submittedReq.newLimit)}</span>],
                    ['Submitted On',    <span className="font-semibold text-xs">
                      {submittedAt
                        ? submittedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
                          ' · ' +
                          submittedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                        : '—'}
                    </span>],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between items-center gap-4">
                      <span className="text-muted-foreground flex-shrink-0">{k}</span>{v}
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={STATUS_BADGE['Pending']}>Pending Review</Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-3 max-w-xs mx-auto w-full">
                <Button variant="outline" onClick={closeDialog} className="flex-1" id="btn-done">Done</Button>
                <Button onClick={() => { closeDialog(); navigate('/dashboard') }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700" id="btn-go-home-success">
                  <Home className="h-4 w-4 mr-2" />Go to Home
                </Button>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CreditLimitIncrease() {
  return (
    <CLIErrorBoundary>
      <CreditLimitIncreaseInner />
    </CLIErrorBoundary>
  )
}
