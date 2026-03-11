import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Zap, Smartphone, Droplets, Wifi, Shield, Tv, Phone, ChevronRight } from 'lucide-react'

const billers = [
  { id: 1, name: 'BESCOM - Electricity', category: 'Electricity', icon: Zap, color: 'text-yellow-600 bg-yellow-50', lastPaid: '₹1,850 on 15 Feb', dueDate: '15 Mar 2026', dueAmount: '₹2,120', status: 'Due' },
  { id: 2, name: 'Airtel Postpaid', category: 'Mobile', icon: Smartphone, color: 'text-red-600 bg-red-50', lastPaid: '₹599 on 20 Feb', dueDate: '20 Mar 2026', dueAmount: '₹599', status: 'Upcoming' },
  { id: 3, name: 'BWSSB - Water Supply', category: 'Water', icon: Droplets, color: 'text-blue-600 bg-blue-50', lastPaid: '₹450 on 01 Mar', dueDate: '01 Apr 2026', dueAmount: '₹480', status: 'Paid' },
  { id: 4, name: 'ACT Fibernet', category: 'Internet', icon: Wifi, color: 'text-purple-600 bg-purple-50', lastPaid: '₹999 on 05 Mar', dueDate: '05 Apr 2026', dueAmount: '₹999', status: 'Paid' },
  { id: 5, name: 'LIC Premium', category: 'Insurance', icon: Shield, color: 'text-emerald-600 bg-emerald-50', lastPaid: '₹12,500 on 01 Jan', dueDate: '01 Apr 2026', dueAmount: '₹12,500', status: 'Upcoming' },
  { id: 6, name: 'Tata Play DTH', category: 'DTH', icon: Tv, color: 'text-orange-600 bg-orange-50', lastPaid: '₹349 on 28 Feb', dueDate: '28 Mar 2026', dueAmount: '₹349', status: 'Due' },
  { id: 7, name: 'BSNL Landline', category: 'Landline', icon: Phone, color: 'text-teal-600 bg-teal-50', lastPaid: '₹750 on 10 Feb', dueDate: '10 Mar 2026', dueAmount: '₹780', status: 'Overdue' },
]

const recentPayments = [
  { id: 1, biller: 'ACT Fibernet', amount: 999, date: '05 Mar 2026', status: 'Success', ref: 'BP-2026-0341' },
  { id: 2, biller: 'BWSSB Water', amount: 450, date: '01 Mar 2026', status: 'Success', ref: 'BP-2026-0298' },
  { id: 3, biller: 'Tata Play DTH', amount: 349, date: '28 Feb 2026', status: 'Success', ref: 'BP-2026-0267' },
  { id: 4, biller: 'Airtel Postpaid', amount: 599, date: '20 Feb 2026', status: 'Success', ref: 'BP-2026-0234' },
  { id: 5, biller: 'BESCOM Electricity', amount: 1850, date: '15 Feb 2026', status: 'Success', ref: 'BP-2026-0201' },
]

export default function BillPayments() {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  const filteredBillers = billers.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in" id="bill-payments-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bill Payments</h2>
          <p className="text-sm text-gray-500 mt-1">Pay your bills quickly and securely</p>
        </div>
        <Button>+ Add New Biller</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="bill-summary">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Due</p>
            <p className="text-xl font-bold text-red-600 mt-1">₹3,829</p>
            <p className="text-xs text-gray-400 mt-1">2 bills pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Paid This Month</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">₹1,449</p>
            <p className="text-xs text-gray-400 mt-1">2 bills paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Upcoming</p>
            <p className="text-xl font-bold text-amber-600 mt-1">₹13,099</p>
            <p className="text-xs text-gray-400 mt-1">2 bills upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Autopay Active</p>
            <p className="text-xl font-bold text-blue-600 mt-1">3</p>
            <p className="text-xs text-gray-400 mt-1">billers enrolled</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="biller-search"
          placeholder="Search billers..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Billers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="billers-grid">
        {filteredBillers.map((biller) => {
          const Icon = biller.icon
          return (
            <Card key={biller.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${biller.color} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{biller.name}</h3>
                      <Badge
                        variant={
                          biller.status === 'Paid' ? 'success' :
                          biller.status === 'Due' ? 'warning' :
                          biller.status === 'Overdue' ? 'destructive' : 'info'
                        }
                      >
                        {biller.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Last: {biller.lastPaid}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Due: {biller.dueDate}</p>
                        <p className="text-lg font-bold text-gray-900">{biller.dueAmount}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={biller.status === 'Paid' ? 'outline' : 'default'}
                        disabled={biller.status === 'Paid'}
                        id={`pay-${biller.id}`}
                      >
                        {biller.status === 'Paid' ? 'Paid ✓' : 'Pay Now'}
                        {biller.status !== 'Paid' && <ChevronRight className="h-3 w-3 ml-1" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Payments */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Recent Bill Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm" id="recent-payments-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Biller</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Reference</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.biller}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{p.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.ref}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success">{p.status}</Badge>
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
