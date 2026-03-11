import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Car, User, Calculator, FileText, ChevronRight, TrendingDown } from 'lucide-react'

const loans = [
  {
    id: 1,
    type: 'Home Loan',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    loanNumber: 'HL-2023-0045',
    sanctionedAmount: 5000000,
    outstandingBalance: 3850000,
    emiAmount: 42500,
    interestRate: 8.5,
    tenure: '20 years',
    nextEmiDate: '05 Apr 2026',
    startDate: 'Jan 2023',
    endDate: 'Jan 2043',
    status: 'Active',
    paidPercentage: 23,
  },
  {
    id: 2,
    type: 'Car Loan',
    icon: Car,
    color: 'from-emerald-500 to-teal-600',
    loanNumber: 'CL-2024-0123',
    sanctionedAmount: 800000,
    outstandingBalance: 520000,
    emiAmount: 16800,
    interestRate: 9.2,
    tenure: '5 years',
    nextEmiDate: '10 Apr 2026',
    startDate: 'Mar 2024',
    endDate: 'Mar 2029',
    status: 'Active',
    paidPercentage: 35,
  },
  {
    id: 3,
    type: 'Personal Loan',
    icon: User,
    color: 'from-purple-500 to-violet-600',
    loanNumber: 'PL-2025-0078',
    sanctionedAmount: 300000,
    outstandingBalance: 180000,
    emiAmount: 12500,
    interestRate: 12.5,
    tenure: '3 years',
    nextEmiDate: '15 Apr 2026',
    startDate: 'Jun 2025',
    endDate: 'Jun 2028',
    status: 'Active',
    paidPercentage: 40,
  },
]

const emiSchedule = [
  { month: 'Apr 2026', principal: 28500, interest: 14000, total: 42500, balance: 3821500 },
  { month: 'May 2026', principal: 28700, interest: 13800, total: 42500, balance: 3792800 },
  { month: 'Jun 2026', principal: 28900, interest: 13600, total: 42500, balance: 3763900 },
  { month: 'Jul 2026', principal: 29100, interest: 13400, total: 42500, balance: 3734800 },
]

export default function Loans() {
  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="loans-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your loan accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            EMI Calculator
          </Button>
          <Button>Apply for Loan</Button>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="loan-summary">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Borrowed</p>
            <p className="text-xl font-bold text-gray-900 mt-1">₹61,00,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Outstanding Balance</p>
            <p className="text-xl font-bold text-red-600 mt-1">₹45,50,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Monthly EMI</p>
            <p className="text-xl font-bold text-blue-600 mt-1">₹71,800</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Active Loans</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="loan-cards">
        {loans.map((loan) => {
          const Icon = loan.icon
          return (
            <Card key={loan.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className={`bg-gradient-to-r ${loan.color} p-5 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{loan.type}</p>
                      <p className="text-xs text-white/70 font-mono">{loan.loanNumber}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-0">{loan.status}</Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Outstanding */}
                <div>
                  <p className="text-xs text-gray-500 font-medium">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-gray-900">₹{loan.outstandingBalance.toLocaleString()}</p>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${loan.color} transition-all duration-500`}
                      style={{ width: `${loan.paidPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{loan.paidPercentage}% paid off</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase font-medium">EMI Amount</p>
                    <p className="text-sm font-bold text-gray-900">₹{loan.emiAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase font-medium">Interest Rate</p>
                    <p className="text-sm font-bold text-gray-900">{loan.interestRate}% p.a.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase font-medium">Tenure</p>
                    <p className="text-sm font-bold text-gray-900">{loan.tenure}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase font-medium">Next EMI</p>
                    <p className="text-sm font-bold text-gray-900">{loan.nextEmiDate}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Statement
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    Prepay
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* EMI Schedule */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Upcoming EMI Schedule - Home Loan</CardTitle>
          <CardDescription>Next 4 months EMI breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm" id="emi-schedule-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Month</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Principal</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Interest</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Total EMI</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {emiSchedule.map((row) => (
                  <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.month}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">₹{row.principal.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-red-500 font-semibold">₹{row.interest.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">₹{row.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">₹{row.balance.toLocaleString()}</td>
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
