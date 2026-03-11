import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function PaymentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    fromAccount: '',
    beneficiary: '',
    amount: '',
    currency: 'INR',
    transferType: '',
    scheduleDate: '',
    description: '',
    otp: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="payment-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Account */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="from-account">From Account</label>
          <Select value={formData.fromAccount} onValueChange={(v) => handleChange('fromAccount', v)}>
            <SelectTrigger id="from-account">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings-4521">Savings A/C - XXXX4521</SelectItem>
              <SelectItem value="current-7834">Current A/C - XXXX7834</SelectItem>
              <SelectItem value="savings-2190">Savings A/C - XXXX2190</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Beneficiary */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="beneficiary">Beneficiary</label>
          <Select value={formData.beneficiary} onValueChange={(v) => handleChange('beneficiary', v)}>
            <SelectTrigger id="beneficiary">
              <SelectValue placeholder="Select beneficiary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priya">Priya Sharma - HDFC</SelectItem>
              <SelectItem value="amit">Amit Patel - SBI</SelectItem>
              <SelectItem value="sunita">Sunita Reddy - ICICI</SelectItem>
              <SelectItem value="vikram">Vikram Singh - Axis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="transfer-amount">Amount</label>
          <Input
            id="transfer-amount"
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="currency">Currency</label>
          <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transfer Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="transfer-type">Transfer Type</label>
          <Select value={formData.transferType} onValueChange={(v) => handleChange('transferType', v)}>
            <SelectTrigger id="transfer-type">
              <SelectValue placeholder="Select transfer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imps">IMPS (Instant)</SelectItem>
              <SelectItem value="neft">NEFT (Within 2 hours)</SelectItem>
              <SelectItem value="rtgs">RTGS (Real-time)</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="schedule-date">Schedule Date</label>
          <Input
            id="schedule-date"
            type="date"
            value={formData.scheduleDate}
            onChange={(e) => handleChange('scheduleDate', e.target.value)}
          />
        </div>
      </div>

      {/* Description - Full width */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="description">Description / Remarks</label>
        <textarea
          id="description"
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200"
          placeholder="Enter remarks for this transfer"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      {/* OTP Field */}
      <div className="space-y-2 max-w-xs">
        <label className="text-sm font-medium text-gray-700" htmlFor="otp-field">OTP Verification</label>
        <div className="flex gap-3">
          <Input
            id="otp-field"
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={(e) => handleChange('otp', e.target.value)}
          />
          <Button type="button" variant="outline" size="sm" className="whitespace-nowrap">
            Send OTP
          </Button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button type="submit" id="submit-transfer" className="px-8">
          Transfer Now
        </Button>
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="button" variant="ghost" className="text-gray-500">
          Cancel
        </Button>
      </div>
    </form>
  )
}
