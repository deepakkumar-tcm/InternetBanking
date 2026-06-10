import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentForm({ onTransferComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fromAccount: '',
    beneficiary: '',
    amount: '',
    currency: 'INR',
    transferType: '',
    description: '',
    otp: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.fromAccount || !formData.beneficiary || !formData.amount || !formData.transferType) {
      toast.error('Required Selection Missing', {
        description: 'Please ensure all mandatory account and beneficiary fields are selected.'
      })
      return
    }

    if (formData.otp.length !== 6) {
       toast.error('Invalid OTP', { description: 'A valid 6-digit confirmation code is required to authorize the transfer.' })
       return
    }

    setIsSubmitting(true)
    
    // Simulate real banking processing delay
    setTimeout(() => {
      setIsSubmitting(false)
      const transferData = {
        ...formData,
        id: `TXN-BNK-${Math.floor(Math.random() * 900000 + 100000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      }
      onTransferComplete?.(transferData)
      toast.success('Funds Transferred Successfully')
    }, 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="payment-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* From Account */}
        <div className="space-y-2">
          <Label htmlFor="from-account" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Source Account</Label>
          <Select value={formData.fromAccount} onValueChange={(v) => handleChange('fromAccount', v)}>
            <SelectTrigger id="from-account" className="w-full bg-muted/20 border-border/50 h-11">
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Savings A/C - XXXX4521">Savings A/C - XXXX4521 (₹4,85,230.50)</SelectItem>
              <SelectItem value="Current A/C - XXXX7834">Current A/C - XXXX7834 (₹1,25,000.00)</SelectItem>
              <SelectItem value="Earnings A/C - XXXX2190">Earnings A/C - XXXX2190 (₹12,400.00)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Beneficiary */}
        <div className="space-y-2">
          <Label htmlFor="beneficiary" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payee / Beneficiary</Label>
          <Select value={formData.beneficiary} onValueChange={(v) => handleChange('beneficiary', v)}>
            <SelectTrigger id="beneficiary" className="w-full bg-muted/20 border-border/50 h-11">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Priya Sharma">Priya Sharma - HDFC Bank</SelectItem>
              <SelectItem value="Amit Patel">Amit Patel - State Bank of India</SelectItem>
              <SelectItem value="Sunita Reddy">Sunita Reddy - ICICI Bank</SelectItem>
              <SelectItem value="Vikram Singh">Vikram Singh - Axis Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="transfer-amount" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Amount</Label>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
             <Input
               id="transfer-amount"
               type="number"
               placeholder="0.00"
               className="pl-7 bg-muted/20 border-border/50 h-11 text-lg font-black"
               value={formData.amount}
               onChange={(e) => handleChange('amount', e.target.value)}
             />
          </div>
        </div>

        {/* Transfer Type */}
        <div className="space-y-2">
          <Label htmlFor="transfer-type" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment Protocol</Label>
          <Select value={formData.transferType} onValueChange={(v) => handleChange('transferType', v)}>
            <SelectTrigger id="transfer-type" className="w-full bg-muted/20 border-border/50 h-11">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMPS">IMPS (Real-time Settlement)</SelectItem>
              <SelectItem value="NEFT">NEFT (Batch Settlement)</SelectItem>
              <SelectItem value="RTGS">RTGS (High Value Transfer)</SelectItem>
              <SelectItem value="UPI">UPI (Unified Interface)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Transaction Remarks</Label>
        <Textarea
          id="description"
          placeholder="e.g. Monthly Rent, Invoice #402"
          className="bg-muted/20 border-border/50 min-h-[80px] resize-none"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      {/* Security */}
      <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4">
        <div className="flex items-center justify-between">
           <Label htmlFor="otp-field" className="text-xs font-black uppercase tracking-widest text-blue-600/60">Authorization Code (OTP)</Label>
           <Button type="button" variant="link" className="h-auto p-0 text-xs font-bold text-blue-600" onClick={() => { setFormData({...formData, otp: '123456'}); toast.info('Demo OTP generated: 123456'); }}>Generate Code</Button>
        </div>
        <div className="flex gap-4">
          <Input
            id="otp-field"
            type="password"
            maxLength={6}
            placeholder="••••••"
            className="bg-background border-2 border-blue-500/20 text-center text-2xl tracking-[0.5em] font-black h-12"
            value={formData.otp}
            onChange={(e) => handleChange('otp', e.target.value)}
          />
          <Button type="submit" id="submit-transfer" size="lg" className="flex-1 shadow-lg shadow-primary/20 h-12 font-bold" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</> : <><Send className="h-4 w-4 mr-2" /> Execute Transfer</>}
          </Button>
        </div>
      </div>
    </form>
  )
}
