import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import {
  Shield, Loader2, KeyRound, User, Eye, EyeOff,
  ShieldCheck, Copy, Check, RefreshCw, MessageSquare,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Demo credentials ────────────────────────────────────────────────────────
const DEMO_USER = { id: 'CUST7821', password: 'SecurePass@123' }

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function Login() {
  const navigate  = useNavigate()
  const [step, setStep]           = useState(1)   // 1 = credentials, 2 = OTP

  // Step 1
  const [userId, setUserId]       = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Step 2
  const [otp, setOtp]             = useState('')
  const [demoOtp, setDemoOtp]     = useState('')
  const [otpBusy, setOtpBusy]     = useState(false)
  const [copied, setCopied]       = useState(false)

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotId, setForgotId]     = useState('')

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') navigate('/dashboard')
  }, [navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    if (!userId.trim() || !password.trim()) { setLoginError('Please enter your Customer ID and Password.'); return }
    setLoginBusy(true)
    setTimeout(() => {
      setLoginBusy(false)
      const newOtp = generateOtp()
      setDemoOtp(newOtp)
      setOtp('')
      setStep(2)
    }, 1200)
  }

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(demoOtp).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleResendOtp = () => {
    const newOtp = generateOtp()
    setDemoOtp(newOtp)
    setOtp('')
    toast.success('New OTP generated.')
  }

  const handleVerifyOtp = () => {
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP.'); return }
    setOtpBusy(true)
    setTimeout(() => {
      setOtpBusy(false)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', DEMO_USER.id)
      toast.success('Login Successful', { description: 'Welcome back, Rajesh Kumar.' })
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 space-y-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Secure<span className="text-blue-600">Bank</span>
            </h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[.35em] mt-1">Internet Banking</p>
          </div>
        </div>

        {/* ── STEP 1: Login form ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-border/40 overflow-hidden">
            <div className="px-7 pt-7 pb-2">
              <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="px-7 pb-7 pt-4 space-y-5">
              {loginError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              {/* Customer ID */}
              <div className="space-y-1.5">
                <Label htmlFor="userId" className="text-xs font-semibold text-slate-700">Customer ID / User ID</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userId"
                    placeholder="Enter your Customer ID"
                    value={userId}
                    onChange={e => { setUserId(e.target.value); setLoginError('') }}
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-400"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLoginError('') }}
                    className="pl-10 pr-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-700"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginBusy}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-bold rounded-xl shadow-lg shadow-blue-500/25 text-white"
              >
                {loginBusy
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
                  : 'Login'}
              </Button>
            </form>

          </div>
        )}

        {/* ── STEP 2: OTP verification ───────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-border/40 overflow-hidden">
            <div className="px-7 pt-7 pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">OTP Verification</h2>
                  <p className="text-sm text-muted-foreground">Enter the OTP sent to your registered mobile</p>
                </div>
              </div>
            </div>

            <div className="px-7 pb-7 pt-5 space-y-5">


              {/* OTP input */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Enter OTP</Label>
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} id="otp-input">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={otpBusy || otp.length !== 6}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-bold rounded-xl shadow-lg shadow-blue-500/25 text-white"
              >
                {otpBusy
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying…</>
                  : 'Verify'}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-slate-700 font-medium"
                >
                  ← Back to Login
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 opacity-50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">256-bit SSL</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RBI Compliant</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-medium">
            © 2026 SecureBank. All rights reserved.
          </p>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your Customer ID to receive a password reset link on your registered email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs font-semibold">Customer ID</Label>
            <Input
              placeholder="Enter your Customer ID"
              value={forgotId}
              onChange={e => setForgotId(e.target.value)}
              className="h-11"
            />
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                if (!forgotId.trim()) { toast.error('Please enter your Customer ID.'); return }
                toast.success('Reset link sent', { description: 'Check your registered email for the reset link.' })
                setForgotOpen(false)
                setForgotId('')
              }}
            >
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
