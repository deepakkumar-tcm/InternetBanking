import { useEffect } from 'react'
import { Wallet, ArrowLeftRight, CreditCard, PiggyBank, SendHorizonal, Receipt, QrCode, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatsCard from '@/components/StatsCard'
import TransactionTable from '@/components/TransactionTable'
import ActivityFeed from '@/components/ActivityFeed'
import NotificationPanel from '@/components/NotificationPanel'

const recentTransactions = [
  { id: 'TXN001', date: '2026-03-11', account: 'Savings - 4521', description: 'Salary Credit - TechCorp', type: 'Credit', amount: 85000, status: 'Completed', reference: 'SAL/MAR/2026' },
  { id: 'TXN002', date: '2026-03-10', account: 'Savings - 4521', description: 'Amazon Purchase', type: 'Debit', amount: 2499, status: 'Success', reference: 'AMZ-78234' },
  { id: 'TXN003', date: '2026-03-10', account: 'Current - 7834', description: 'NEFT to Priya Sharma', type: 'Debit', amount: 25000, status: 'Success', reference: 'NEFT/2026/0892' },
  { id: 'TXN004', date: '2026-03-09', account: 'Savings - 4521', description: 'Electricity Bill - BESCOM', type: 'Debit', amount: 1850, status: 'Processing', reference: 'BILL/ELEC/0345' },
  { id: 'TXN005', date: '2026-03-09', account: 'Savings - 4521', description: 'Flipkart Refund', type: 'Credit', amount: 799, status: 'Completed', reference: 'FK-REF-90123' },
]

const spendingCategories = [
  { category: 'Shopping', amount: 12450, percentage: 32, color: 'bg-blue-500' },
  { category: 'Bills & Utilities', amount: 8900, percentage: 23, color: 'bg-emerald-500' },
  { category: 'Food & Dining', amount: 6700, percentage: 17, color: 'bg-orange-500' },
  { category: 'Transport', amount: 4200, percentage: 11, color: 'bg-purple-500' },
  { category: 'Entertainment', amount: 3100, percentage: 8, color: 'bg-pink-500' },
  { category: 'Others', amount: 3650, percentage: 9, color: 'bg-gray-400' },
]

export default function Dashboard() {
  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-page">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Rajesh! 👋</h2>
            <p className="text-blue-100 mt-1">Here's what's happening with your accounts today.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <Button variant="secondary" className="bg-white/10 text-white border-0 hover:bg-white/20 backdrop-blur-sm">
              <SendHorizonal className="h-4 w-4 mr-2" /> Quick Transfer
            </Button>
            <Button variant="secondary" className="bg-white/10 text-white border-0 hover:bg-white/20 backdrop-blur-sm">
              <QrCode className="h-4 w-4 mr-2" /> Scan & Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-cards">
        <StatsCard
          id="stat-total-balance"
          title="Total Balance"
          value="₹4,85,230.50"
          change="+12.5%"
          changeType="positive"
          icon={Wallet}
          color="blue"
        />
        <StatsCard
          id="stat-monthly-income"
          title="Monthly Income"
          value="₹1,25,000"
          change="+8.2%"
          changeType="positive"
          icon={PiggyBank}
          color="green"
        />
        <StatsCard
          id="stat-monthly-spending"
          title="Monthly Spending"
          value="₹39,000"
          change="-3.1%"
          changeType="negative"
          icon={CreditCard}
          color="purple"
        />
        <StatsCard
          id="stat-transactions"
          title="Transactions"
          value="156"
          change="+18.7%"
          changeType="positive"
          icon={ArrowLeftRight}
          color="orange"
        />
      </div>

      {/* Main Grid: Transactions + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={recentTransactions} compact />
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - Activity & Notifications */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3" id="quick-actions">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200">
                  <SendHorizonal className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium">Transfer</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-200">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-medium">Pay Bills</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium">Cards</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200">
                  <Plus className="h-5 w-5 text-orange-600" />
                  <span className="text-xs font-medium">New FD</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationPanel />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spending Analytics + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Spending Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" id="spending-analytics">
              {spendingCategories.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    <span className="text-sm font-semibold text-gray-900">₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-900">₹39,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
              See All
            </Button>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
