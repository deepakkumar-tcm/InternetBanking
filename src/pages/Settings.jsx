import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { User, Shield, Bell, Gauge, Save, Upload, Eye, EyeOff, Info, Loader2, Trash2, Smartphone, ShieldCheck, History, Laptop } from 'lucide-react'
import { toast } from 'sonner'

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [upiLimit, setUpiLimit] = useState([100000])
  const [posLimit, setPosLimit] = useState([50000])
  const [onlineLimit, setOnlineLimit] = useState([200000])

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
  }, [])

  const handleSave = (section) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(`${section} updated successfully!`, {
        description: `Your ${section.toLowerCase()} changes have been saved to our secure servers.`
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-fade-in" id="settings-page">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">System Configuration</h2>
          <p className="text-sm text-muted-foreground font-medium">Manage your digital identity, security vaults, and interface preferences</p>
        </div>
        <AlertDialog>
           <AlertDialogTrigger asChild>
             <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 border-destructive/20 font-bold">
               <Trash2 className="h-4 w-4 mr-2" /> Reset All
             </Button>
           </AlertDialogTrigger>
           <AlertDialogContent id="alert-reset-settings">
             <AlertDialogHeader>
               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
               <AlertDialogDescription>
                 This action will revert all your personalized settings, limits, and notification preferences to the bank defaults. This cannot be undone.
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel Protocol</AlertDialogCancel>
               <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast.success('Settings reset to default')}>
                 Reset Settings
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList id="settings-tabs" className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-background data-[state=active]:shadow-sm"><Gauge className="h-4 w-4 mr-2" />Limits</TabsTrigger>
        </TabsList>

        {/* ─── Profile ─── */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-6 border-b border-border/20">
              <CardTitle className="text-lg font-bold">Personal Profile</CardTitle>
              <CardDescription className="font-medium">Maintain your contact information for account security and communications.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10" id="profile-form">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="h-24 w-24 shrink-0 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/20 ring-4 ring-background">RK</div>
                  <div className="space-y-3 text-center sm:text-left">
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => toast.info('Image upload is currently disabled')}><Upload className="h-4 w-4 mr-2" />Upload New Photo</Button>
                       <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 font-bold">Remove</Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Recommended: Square JPG/PNG, min 400x400px</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2"><Label htmlFor="first-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">First Name</Label><Input id="first-name" defaultValue="Rajesh" className="bg-muted/20 border-border/50 h-11" /></div>
                  <div className="space-y-2"><Label htmlFor="last-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Last Name</Label><Input id="last-name" defaultValue="Kumar" className="bg-muted/20 border-border/50 h-11" /></div>
                  <div className="space-y-2"><Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary Email</Label><Input id="email" type="email" defaultValue="rajesh.kumar@email.com" className="bg-muted/20 border-border/50 h-11" /></div>
                  <div className="space-y-2"><Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label><Input id="phone" type="tel" defaultValue="+91 98765 43210" className="bg-muted/20 border-border/50 h-11" /></div>
                  <div className="space-y-2 md:col-span-2"><Label htmlFor="address" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Permanent Address</Label><Textarea id="address" defaultValue="42, 3rd Cross, HSR Layout, Sector 7, Bangalore - 560102, Karnataka" className="bg-muted/20 border-border/50 min-h-[100px] resize-none" /></div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/20">
                  <p className="text-xs text-muted-foreground font-medium italic">Last updated: 11 Mar 2026, 09:12 AM</p>
                  <div className="flex gap-3">
                    <Button id="save-profile" size="lg" className="px-8 font-bold" onClick={() => handleSave('Profile')} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Security ─── */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-6 border-b border-border/20">
              <CardTitle className="text-lg font-bold">Account Protection</CardTitle>
              <CardDescription className="font-medium">Maintain a high security level by updating your password regularly.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="max-w-md space-y-6" id="security-form">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input id="current-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="bg-muted/20 border-border/50 h-11 pr-12" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" placeholder="Min 12 characters" className="bg-muted/20 border-border/50 h-11" /></div>
                <div className="space-y-2"><Label htmlFor="confirm-password">Confirm Password</Label><Input id="confirm-password" type="password" placeholder="Repeat new password" className="bg-muted/20 border-border/50 h-11" /></div>
                <Button id="update-password" size="lg" className="w-full font-bold" onClick={() => handleSave('Password')} disabled={isSaving}>
                   {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Update Account Security'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-6 border-b border-border/20">
              <CardTitle className="text-lg font-bold">Verified Devices</CardTitle>
              <CardDescription className="font-medium">Manage hardware authorized to access this secure portal.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4" id="verified-devices">
                {[
                  { name: 'iPhone 15 Pro', type: 'Primary Device', active: 'Current Session', icon: Smartphone, color: 'text-blue-500' },
                  { name: 'MacBook Pro 14"', type: 'Desktop Browser', active: '2 hours ago', icon: Laptop, color: 'text-slate-500' },
                ].map((device, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/5 group">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${device.color}`}>
                          <device.icon className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold tracking-tight">{device.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{device.type} • {device.active}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-destructive hover:bg-destructive/5">Revoke</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-security" className="border-border/50 bg-muted/5 rounded-xl px-4 overflow-hidden">
               <AccordionTrigger className="hover:no-underline font-bold text-sm">Advanced Security Protocols</AccordionTrigger>
               <AccordionContent className="space-y-4 pb-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold">Automatic Session Timeout</p>
                        <p className="text-[10px] text-muted-foreground">Log out after 5 minutes of inactivity</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold">Restrict Overseas Access</p>
                        <p className="text-[10px] text-muted-foreground">Reject logins from outside home country</p>
                     </div>
                     <Switch />
                  </div>
               </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* ─── Notifications ─── */}
        <TabsContent value="notifications">
          <Card className="border-border/50">
            <CardHeader className="pb-6 border-b border-border/20">
              <CardTitle className="text-lg font-bold">Channel Management</CardTitle>
              <CardDescription className="font-medium">Direct how and where you receive critical account alerts.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4" id="notification-settings">
                {[
                  { label: 'Money Transfers', desc: 'Alerts for all fund movement', sms: true, email: true },
                  { label: 'Account Access', desc: 'Security alerts for login attempts', sms: true, email: true },
                  { label: 'Bill Reminders', desc: 'Upcoming payment due dates', sms: false, email: true },
                  { label: 'Product Offers', desc: 'Relevant banking recommendations', sms: false, email: false },
                ].map((pref, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/50 p-5 hover:border-primary/20 transition-colors">
                    <div className="max-w-md">
                      <p className="text-sm font-bold tracking-tight">{pref.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">{pref.desc}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2"><Switch defaultChecked={pref.sms} onCheckedChange={(v) => toast.info('SMS alerts ' + (v ? 'on' : 'off'))} /><span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">SMS</span></div>
                      <div className="flex items-center gap-2"><Switch defaultChecked={pref.email} onCheckedChange={(v) => toast.info('Email alerts ' + (v ? 'on' : 'off'))} /><span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border/20 flex justify-end">
                <Button id="save-notifications" size="lg" className="px-10 font-bold" onClick={() => handleSave('Preferences')} disabled={isSaving}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Limits ─── */}
        <TabsContent value="limits">
          <Card className="border-border/50">
            <CardHeader className="pb-6 border-b border-border/20">
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Velocity Constraints</CardTitle>
                    <CardDescription className="font-medium">Define your comfort levels for digital transactions.</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Lower limits provide better protection against large unauthorized transactions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
               </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-12" id="limits-form">
                <div className="space-y-8 p-6 rounded-2xl border border-border/50 bg-muted/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600"><Smartphone className="h-4 w-4" /></div>
                         <Label className="text-sm font-bold">Daily UPI Velocity</Label>
                      </div>
                      <span className="text-sm font-black text-blue-600 bg-blue-500/10 px-3 py-1 rounded-full">₹{upiLimit[0].toLocaleString()}</span>
                   </div>
                   <Slider value={upiLimit} onValueChange={setUpiLimit} max={200000} step={5000} className="w-full" />
                   <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                      <span>Min: ₹0</span>
                      <span>Max Exposure: ₹2,00,000</span>
                   </div>
                </div>

                <div className="space-y-8 p-6 rounded-2xl border border-border/50 bg-muted/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><History className="h-4 w-4" /></div>
                         <Label className="text-sm font-bold">Ecommerce / POS Cap</Label>
                      </div>
                      <span className="text-sm font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">₹{posLimit[0].toLocaleString()}</span>
                   </div>
                   <Slider value={posLimit} onValueChange={setPosLimit} max={100000} step={1000} className="w-full" />
                </div>

                <div className="space-y-8 p-6 rounded-2xl border border-border/50 bg-muted/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600"><ShieldCheck className="h-4 w-4" /></div>
                         <Label className="text-sm font-bold">Net Banking Transfer Limit</Label>
                      </div>
                      <span className="text-sm font-black text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">₹{onlineLimit[0].toLocaleString()}</span>
                   </div>
                   <Slider value={onlineLimit} onValueChange={setOnlineLimit} max={500000} step={10000} className="w-full" />
                </div>

                <div className="flex justify-end pt-4">
                   <Button size="lg" className="px-12 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20" onClick={() => handleSave('Velocity Limits')}>Deploy Upgraded Limits</Button>
                </div>

                <Alert className="mt-8 bg-blue-500/5 border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700 font-bold">Protocol Information</AlertTitle>
                  <AlertDescription className="text-blue-600/80 font-medium">Limit upgrades require an additional multi-factor authentication and are typically processed within 24 standard business hours.</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
