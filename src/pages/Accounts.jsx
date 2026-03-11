import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AccountCard from '@/components/AccountCard'
import { Plus, Download, Filter } from 'lucide-react'

const accounts = [
  {
    id: 'acc-1',
    type: 'savings',
    label: 'Savings Account',
    number: 'XXXX XXXX XXXX 4521',
    balance: 285230.50,
    currency: 'INR',
    branch: 'Koramangala, Bangalore',
    ifsc: 'SBIN0001234',
    lastActivity: '2 hours ago',
    status: 'Active',
  },
  {
    id: 'acc-2',
    type: 'current',
    label: 'Current Account',
    number: 'XXXX XXXX XXXX 7834',
    balance: 142500.00,
    currency: 'INR',
    branch: 'MG Road, Bangalore',
    ifsc: 'SBIN0005678',
    lastActivity: '1 day ago',
    status: 'Active',
  },
  {
    id: 'acc-3',
    type: 'fixed',
    label: 'Fixed Deposit',
    number: 'XXXX XXXX XXXX 9012',
    balance: 500000.00,
    currency: 'INR',
    branch: 'Koramangala, Bangalore',
    ifsc: 'SBIN0001234',
    lastActivity: '30 days ago',
    status: 'Locked',
  },
]

const accountSummary = [
  { label: 'Total Assets', value: '₹9,27,730.50', change: '+₹85,000' },
  { label: 'Total Liabilities', value: '₹3,45,000.00', change: '-₹12,500' },
  { label: 'Net Worth', value: '₹5,82,730.50', change: '+₹97,500' },
]

export default function Accounts() {
  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="accounts-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all your bank accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Open New Account
          </Button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="account-summary">
        {accountSummary.map((item) => (
          <Card key={item.label} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-2">{item.change} this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="account-cards">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} id={account.id} />
        ))}
      </div>

      {/* Account Details Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account Details</CardTitle>
          <Badge variant="info">3 Active Accounts</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Account Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Balance</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{acc.label}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs">{acc.number}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">{acc.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={acc.status === 'Active' ? 'success' : 'warning'}>{acc.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" className="text-blue-600">View</Button>
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
