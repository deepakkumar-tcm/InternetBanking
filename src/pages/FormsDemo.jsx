import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator
} from '@/components/ui/input-otp'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command'
import {
  DollarSign, Calendar as CalendarIcon, Check, ChevronsUpDown,
  CheckCircle2, Loader2, Send, User, Building2, Globe, Lock, Bell, CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const beneficiaries = [
  { label: 'Priya Anand – SBI', value: 'priya-sbi' },
  { label: 'Family Account – HDFC', value: 'family-hdfc' },
  { label: 'Suresh Kumar – ICICI', value: 'suresh-icici' },
  { label: 'Asha Mehta – Axis', value: 'asha-axis' },
  { label: 'Office Account – Kotak', value: 'office-kotak' },
]

export default function FormsDemo() {
  const [transferType, setTransferType] = useState('neft')
  const [amount, setAmount] = useState(10000)
  const [sliderAmount, setSliderAmount] = useState([10000])
  const [fromAccount, setFromAccount] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [beneficiaryOpen, setBeneficiaryOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [date, setDate] = useState(new Date())
  const [calOpen, setCalOpen] = useState(false)
  const [switches, setSwitches] = useState({
    notifications: true, smsAlerts: true, emailAlerts: false, twoFactor: true, autoLock: false
  })
  const [checkboxes, setCheckboxes] = useState({
    saveBeneficiary: true, scheduleRecurring: false, acceptTerms: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    console.log('[ROUTE] Current path:', window.location.pathname)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!checkboxes.acceptTerms) {
      toast.error('Please accept the terms to proceed.')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    setSubmitting(false)
    setSubmitted(true)
    toast.success('Transfer initiated successfully!', { description: `₹${amount.toLocaleString('en-IN')} transfer is being processed.` })
  }

  return (
    <div id="forms-demo-page" className="space-y-10 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Forms Demo</h1>
        <p className="text-muted-foreground mt-1.5">Large-scale forms with all input components demonstrated</p>
      </div>

      {/* ─── FUND TRANSFER FORM ─── */}
      <section id="section-transfer-form">
        <h2 className="text-xl font-bold mb-4">Fund Transfer Form</h2>
        <p className="text-sm text-muted-foreground mb-6">Complete transfer workflow with all form elements</p>

        <form onSubmit={handleSubmit} id="transfer-form">
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>New Fund Transfer</CardTitle>
              </div>
              <CardDescription>Fill in all details to initiate a transfer</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">

              {/* Transfer Type – Radio Group */}
              <div id="field-transfer-type">
                <Label className="text-sm font-semibold mb-3 block">Transfer Type</Label>
                <RadioGroup
                  value={transferType}
                  onValueChange={setTransferType}
                  id="transfer-type-radio-group"
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {[
                    { value: 'neft', label: 'NEFT', sub: 'Up to ₹2L' },
                    { value: 'rtgs', label: 'RTGS', sub: 'Above ₹2L' },
                    { value: 'imps', label: 'IMPS', sub: 'Instant' },
                    { value: 'upi', label: 'UPI', sub: 'Scan & Pay' },
                  ].map(item => (
                    <Label
                      key={item.value}
                      htmlFor={`radio-${item.value}`}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50',
                        transferType === item.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background'
                      )}
                    >
                      <RadioGroupItem value={item.value} id={`radio-${item.value}`} className="sr-only" />
                      <span className="font-bold text-base">{item.label}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{item.sub}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* From / To accounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Account – Select */}
                <div id="field-from-account" className="space-y-2">
                  <Label htmlFor="from-account-select" className="text-sm font-semibold">From Account</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger id="from-account-select" className="h-11">
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sav-4521">Savings – •••• 4521 (₹1,52,340)</SelectItem>
                      <SelectItem value="cur-8832">Current – •••• 8832 (₹3,00,000)</SelectItem>
                      <SelectItem value="fd-3312" disabled>FD – •••• 3312 (Locked)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Beneficiary – Combobox */}
                <div id="field-beneficiary" className="space-y-2">
                  <Label className="text-sm font-semibold">To Beneficiary</Label>
                  <Popover open={beneficiaryOpen} onOpenChange={setBeneficiaryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="beneficiary-combobox-trigger"
                        variant="outline"
                        role="combobox"
                        aria-expanded={beneficiaryOpen}
                        className="w-full h-11 justify-between font-normal"
                      >
                        {beneficiary
                          ? beneficiaries.find(b => b.value === beneficiary)?.label
                          : 'Search beneficiary...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" id="beneficiary-combobox-content">
                      <Command>
                        <CommandInput placeholder="Search beneficiary..." id="beneficiary-search" />
                        <CommandList>
                          <CommandEmpty>No beneficiary found.</CommandEmpty>
                          <CommandGroup>
                            {beneficiaries.map(b => (
                              <CommandItem
                                key={b.value}
                                value={b.value}
                                onSelect={(curr) => {
                                  setBeneficiary(curr === beneficiary ? '' : curr)
                                  setBeneficiaryOpen(false)
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', beneficiary === b.value ? 'opacity-100' : 'opacity-0')} />
                                {b.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Amount + Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="field-amount" className="space-y-2">
                  <Label htmlFor="transfer-amount" className="text-sm font-semibold">Amount (₹)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="transfer-amount"
                      type="number"
                      value={amount}
                      onChange={e => { setAmount(Number(e.target.value)); setSliderAmount([Number(e.target.value)]) }}
                      className="pl-9 h-11"
                      placeholder="10,000"
                      min={1}
                      max={500000}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Amount in words: {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '—'}</p>
                </div>
                <div id="field-remarks" className="space-y-2">
                  <Label htmlFor="transfer-remarks" className="text-sm font-semibold">Reference / Remarks</Label>
                  <Input
                    id="transfer-remarks"
                    placeholder="e.g. Rent for March 2024"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Slider for quick amount selection */}
              <div id="field-amount-slider" className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Quick Amount Selection</Label>
                  <Badge variant="outline" className="font-mono">₹{sliderAmount[0].toLocaleString('en-IN')}</Badge>
                </div>
                <Slider
                  id="amount-slider"
                  min={1000}
                  max={200000}
                  step={1000}
                  value={sliderAmount}
                  onValueChange={vals => { setSliderAmount(vals); setAmount(vals[0]) }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Schedule Date */}
              <div id="field-schedule-date" className="space-y-2">
                <Label className="text-sm font-semibold">Schedule Transfer Date</Label>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="btn-date-picker"
                      variant="outline"
                      className={cn('w-full md:w-64 h-11 justify-start font-normal', !date && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" id="calendar-popover">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={d => { setDate(d); setCalOpen(false) }}
                      initialFocus
                      id="transfer-calendar"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* OTP Section */}
              <Separator />
              <div id="field-otp" className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Transaction OTP</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Enter the 6-digit OTP sent to your registered mobile</p>
                  </div>
                  <Button
                    type="button"
                    id="btn-send-otp"
                    variant="outline"
                    size="sm"
                    onClick={() => { setOtpSent(true); toast.info('OTP sent to ••••••7890') }}
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </Button>
                </div>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} id="otp-input">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} id="otp-slot-0" />
                    <InputOTPSlot index={1} id="otp-slot-1" />
                    <InputOTPSlot index={2} id="otp-slot-2" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} id="otp-slot-3" />
                    <InputOTPSlot index={4} id="otp-slot-4" />
                    <InputOTPSlot index={5} id="otp-slot-5" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Checkboxes */}
              <Separator />
              <div id="field-checkboxes" className="space-y-3">
                <Label className="text-sm font-semibold block mb-2">Options</Label>
                {[
                  { key: 'saveBeneficiary', label: 'Save beneficiary for future use', id: 'chk-save-bene' },
                  { key: 'scheduleRecurring', label: 'Schedule as recurring monthly transfer', id: 'chk-recurring' },
                  { key: 'acceptTerms', label: 'I accept the terms & conditions of this transfer', id: 'chk-terms', required: true },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3">
                    <Checkbox
                      id={item.id}
                      checked={checkboxes[item.key]}
                      onCheckedChange={v => setCheckboxes(prev => ({ ...prev, [item.key]: v }))}
                    />
                    <Label htmlFor={item.id} className="text-sm cursor-pointer">
                      {item.label}
                      {item.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 justify-end border-t pt-6">
              <Button type="button" id="btn-reset-transfer" variant="outline" onClick={() => { setSubmitted(false); setOtp(''); }}>
                Reset
              </Button>
              <Button
                type="submit"
                id="btn-submit-transfer"
                disabled={submitting || submitted}
                className="min-w-32"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : submitted ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> Submitted</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Initiate Transfer</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </section>

      {/* ─── SETTINGS FORM ─── */}
      <section id="section-settings-form">
        <h2 className="text-xl font-bold mb-4">Account Settings Form</h2>
        <p className="text-sm text-muted-foreground mb-6">Switches, text areas, and additional input types</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Switches */}
          <Card className="border shadow-sm" id="card-notification-switches">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Notifications</CardTitle>
              </div>
              <CardDescription>Manage how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'notifications', label: 'Push Notifications', desc: 'Receive alerts on your device', id: 'sw-push' },
                { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Transaction alerts via SMS', id: 'sw-sms' },
                { key: 'emailAlerts', label: 'Email Digest', desc: 'Weekly summary via email', id: 'sw-email' },
                { key: 'twoFactor', label: 'Two-Factor Auth', desc: 'OTP on every login', id: 'sw-2fa' },
                { key: 'autoLock', label: 'Auto-Lock (5 min)', desc: 'Lock session after inactivity', id: 'sw-autolock' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.id} className="cursor-pointer font-medium text-sm">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={switches[item.key]}
                    onCheckedChange={v => setSwitches(prev => ({ ...prev, [item.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile & Address Form */}
          <Card className="border shadow-sm" id="card-profile-form">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-first-name">First Name</Label>
                  <Input id="profile-first-name" defaultValue="Rajesh" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-last-name">Last Name</Label>
                  <Input id="profile-last-name" defaultValue="Kumar" className="h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input id="profile-email" type="email" defaultValue="rajesh.kumar@email.com" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-mobile">Mobile Number</Label>
                <Input id="profile-mobile" type="tel" defaultValue="+91 98765 43210" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-address">Correspondence Address</Label>
                <Textarea
                  id="profile-address"
                  rows={3}
                  defaultValue="12A, Green Valley Apartments, MG Road, Bangalore - 560001"
                  className="resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-country">Country</Label>
                <Select defaultValue="india">
                  <SelectTrigger id="profile-country" className="h-9">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">🇮🇳 India</SelectItem>
                    <SelectItem value="usa">🇺🇸 United States</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="aus">🇦🇺 Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button id="btn-save-profile" className="w-full" onClick={() => toast.success('Profile updated successfully!')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── CARD MANAGEMENT FORM ─── */}
      <section id="section-card-form">
        <h2 className="text-xl font-bold mb-4">Card Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm" id="card-limits-form">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Card Limits</CardTitle>
              </div>
              <CardDescription>Visa Platinum ending in 4521</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: 'Daily Online Spend', max: 100000, value: [50000] },
                { label: 'International Transactions', max: 500000, value: [200000] },
                { label: 'ATM Withdrawal Limit', max: 50000, value: [25000] },
              ].map((item, i) => (
                <div key={i} className={`space-y-2`} id={`card-limit-field-${i}`}>
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <Badge variant="outline" className="font-mono text-xs">₹{item.value[0].toLocaleString('en-IN')}</Badge>
                  </div>
                  <Slider min={0} max={item.max} step={1000} defaultValue={item.value} id={`slider-card-${i}`} />
                </div>
              ))}
              <Button id="btn-save-card-limits" variant="outline" className="w-full" onClick={() => toast.success('Card limits updated!')}>
                <Lock className="h-4 w-4 mr-2" /> Save Limits
              </Button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm" id="card-security-form">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Card Security</CardTitle>
              </div>
              <CardDescription>Enable or disable card features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="card-pin">Change Card PIN</Label>
                <Input id="card-pin" type="password" placeholder="New 4-digit PIN" maxLength={4} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-pin-confirm">Confirm PIN</Label>
                <Input id="card-pin-confirm" type="password" placeholder="Confirm new PIN" maxLength={4} className="h-9" />
              </div>
              <Separator />
              {[
                { id: 'sw-contactless', label: 'Contactless Payments', defaultChecked: true },
                { id: 'sw-online-txn', label: 'Online Transactions', defaultChecked: true },
                { id: 'sw-intl-txn', label: 'International Use', defaultChecked: false },
                { id: 'sw-atm', label: 'ATM Withdrawals', defaultChecked: true },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <Label htmlFor={item.id} className="text-sm cursor-pointer">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.defaultChecked} />
                </div>
              ))}
              <Button id="btn-save-card-security" className="w-full mt-2" onClick={() => toast.success('Card security updated!')}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── CALENDAR STANDALONE ─── */}
      <section id="section-calendar">
        <h2 className="text-xl font-bold mb-4">Calendar</h2>
        <Card className="border shadow-sm inline-block" id="calendar-card">
          <CardHeader>
            <CardTitle className="text-base">Schedule a Branch Appointment</CardTitle>
            <CardDescription>Select your preferred date for the appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              id="standalone-calendar"
              className="rounded-md"
            />
            {date && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  Selected: {date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
            <Button
              id="btn-book-appointment"
              className="mt-4 w-full"
              onClick={() => date && toast.success(`Appointment on ${date.toLocaleDateString('en-IN')} confirmed!`)}
            >
              Book Appointment
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
