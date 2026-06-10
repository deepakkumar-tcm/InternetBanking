import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Shield, Loader2, KeyRound, UserPlus, Info, Fingerprint, Lock, ShieldCheck, Cpu } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, go to dashboard
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setShowError(false)

    // Simulate API delay
    setTimeout(() => {
      // For demo, any email with 'error' shows an alert
      if (email.includes('error')) {
        setShowError(true)
        setIsLoading(false)
        toast.error('Authentication Failed', { description: 'Please check your credentials.' })
        return
      }

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      toast.success('Access Granted', { description: 'Welcome back to the secure portal.' })
      navigate('/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Orbs for Premium Look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/30 ring-8 ring-blue-500/5 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Secure<span className="text-blue-600">Bank</span></h1>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-[.4em]">Military Grade Gateway</p>
          </div>
        </div>

        <Card className="border-border/40 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Portal Access</CardTitle>
              <HoverCard>
                 <HoverCardTrigger asChild>
                    <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center cursor-help">
                       <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                 </HoverCardTrigger>
                 <HoverCardContent className="w-80">
                    <div className="flex space-x-4">
                       <ShieldCheck className="h-10 w-10 text-emerald-500 mt-1" />
                       <div className="space-y-1">
                          <h4 className="text-sm font-bold uppercase tracking-widest">TLS 1.3 Encryption</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                             This session is secured with AES-256-GCM. All inputs are sanitized and monitored by our real-time audit engine.
                          </p>
                       </div>
                    </div>
                 </HoverCardContent>
              </HoverCard>
            </div>
            <CardDescription className="font-medium">Digitally sign in to your encrypted financial hub</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {showError && (
                 <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>Protocol mismatch or invalid token signatures.</AlertDescription>
                 </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Identifier</Label>
                <div className="relative group">
                   <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter system ID or email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted/30 border-none h-12 rounded-2xl pl-11 group-focus-within:ring-2 ring-blue-500/20 transition-all font-medium"
                   />
                   <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Key</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="link" className="px-0 font-bold h-auto text-[10px] uppercase tracking-widest text-blue-600 opacity-70 hover:opacity-100" type="button">Lost Access?</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Recovery Protocol</DialogTitle>
                        <DialogDescription>
                          Enter your registered identity to initiate a secure recovery sequence via secondary channels.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="rec-email">Secondary Identifier</Label>
                          <Input id="rec-email" placeholder="Verification Email" className="h-11" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full h-11 font-bold">DISPATCH TOKEN</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative group">
                   <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted/30 border-none h-12 rounded-2xl pl-11 group-focus-within:ring-2 ring-blue-500/20 transition-all font-medium"
                   />
                   <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 pt-2">
              <Button type="submit" className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    DECRYPTING VAULT...
                  </>
                ) : (
                  <>
                     <Lock className="h-4 w-4 mr-3" /> VERIFY IDENTITY
                  </>
                )}
              </Button>
              
              <div className="w-full flex items-center gap-4">
                 <Separator className="flex-1" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Portal Registry</span>
                 <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <Button variant="outline" className="h-11 rounded-xl font-bold border-border/50 bg-muted/5 group" type="button">
                    <Cpu className="h-4 w-4 mr-2 group-hover:text-blue-600" /> Hardware
                 </Button>
                 <Button variant="outline" className="h-11 rounded-xl font-bold border-border/50 bg-muted/5 group" type="button">
                    <UserPlus className="h-4 w-4 mr-2 group-hover:text-blue-600" /> Register
                 </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-4">
           <div className="flex items-center justify-center gap-6 opacity-40">
              <div className="flex flex-col items-center">
                 <IconPair icon={ShieldCheck} label="FIPS 140-2" />
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex flex-col items-center">
                 <IconPair icon={Lock} label="SOC 2 Type II" />
              </div>
           </div>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
             &copy; 2026 SecureBank Advanced Financial Services. <br />
             Authorized by Global Prudential Authority. Code: SB-SYS-09AX
           </p>
        </div>
      </div>
    </div>
  )
}

function IconPair({ icon: Icon, label }) {
   return (
      <div className="flex flex-col items-center gap-1">
         <Icon className="h-4 w-4" />
         <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
      </div>
   )
}
