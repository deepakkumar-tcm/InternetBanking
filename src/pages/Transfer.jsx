import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PaymentForm from '@/components/PaymentForm'
import { CheckCircle, Clock, AlertTriangle, IndianRupee } from 'lucide-react'

const recentTransfers = [
  { id: 1, to: 'Priya Sharma', bank: 'HDFC Bank', amount: 25000, date: '11 Mar 2026', type: 'NEFT', status: 'Completed' },
  { id: 2, to: 'Amit Patel', bank: 'SBI', amount: 15000, date: '10 Mar 2026', type: 'IMPS', status: 'Completed' },
  { id: 3, to: 'Sunita Reddy', bank: 'ICICI Bank', amount: 8000, date: '09 Mar 2026', type: 'UPI', status: 'Processing' },
  { id: 4, to: 'Vikram Singh', bank: 'Axis Bank', amount: 32000, date: '08 Mar 2026', type: 'RTGS', status: 'Completed' },
]

const transferLimits = [
  { type: 'IMPS', daily: '₹5,00,000', used: '₹25,000', remaining: '₹4,75,000' },
  { type: 'NEFT', daily: '₹10,00,000', used: '₹0', remaining: '₹10,00,000' },
  { type: 'RTGS', daily: '₹25,00,000', used: '₹32,000', remaining: '₹24,68,000' },
  { type: 'UPI', daily: '₹1,00,000', used: '₹8,000', remaining: '₹92,000' },
]

export default function Transfer() {
  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="transfer-page">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transfer Money</h2>
        <p className="text-sm text-gray-500 mt-1">Send money to your beneficiaries securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>New Transfer</CardTitle>
              <CardDescription>Fill in the details below to initiate a fund transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm />
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Transfer Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Transfer Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" id="transfer-limits">
              {transferLimits.map((limit) => (
                <div key={limit.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{limit.type}</span>
                    <span className="text-xs text-gray-500">Limit: {limit.daily}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: '5%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Used: {limit.used}</span>
                    <span>Left: {limit.remaining}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Transfer Tips</p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1.5">
                    <li>• IMPS transfers are instant 24x7</li>
                    <li>• NEFT settles in batches every 30 min</li>
                    <li>• RTGS is for amounts above ₹2 Lakhs</li>
                    <li>• UPI transfers have ₹1 Lakh daily limit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transfers */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transfers</CardTitle>
          <Badge variant="info">{recentTransfers.length} transfers this week</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm" id="recent-transfers-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Beneficiary</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Bank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransfers.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.to}</td>
                    <td className="px-4 py-3 text-gray-600">{t.bank}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{t.type}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{t.date}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
