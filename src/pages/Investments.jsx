import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, BarChart3, PieChart, DollarSign, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'

const portfolioSummary = {
  totalValue: 1250000,
  invested: 1100000,
  returns: 150000,
  returnsPercent: 13.6,
  todayChange: 4500,
  todayChangePercent: 0.36,
}

const investments = [
  {
    id: 1,
    category: 'Mutual Funds',
    icon: PieChart,
    color: 'from-blue-500 to-indigo-600',
    holdings: [
      { name: 'HDFC Flexi Cap Fund', invested: 200000, currentValue: 245000, returns: 22.5, units: 1250.45, nav: 195.92 },
      { name: 'SBI Small Cap Fund', invested: 150000, currentValue: 185000, returns: 23.3, units: 890.23, nav: 207.82 },
      { name: 'Axis Bluechip Fund', invested: 100000, currentValue: 112000, returns: 12.0, units: 2340.67, nav: 47.85 },
    ],
  },
  {
    id: 2,
    category: 'Stocks',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-600',
    holdings: [
      { name: 'Reliance Industries', invested: 100000, currentValue: 128000, returns: 28.0, units: 40, nav: 3200 },
      { name: 'TCS', invested: 80000, currentValue: 92000, returns: 15.0, units: 25, nav: 3680 },
      { name: 'Infosys', invested: 70000, currentValue: 65000, returns: -7.1, units: 45, nav: 1444 },
      { name: 'HDFC Bank', invested: 50000, currentValue: 58000, returns: 16.0, units: 35, nav: 1657 },
    ],
  },
  {
    id: 3,
    category: 'Fixed Deposits',
    icon: DollarSign,
    color: 'from-purple-500 to-violet-600',
    holdings: [
      { name: 'FD - 1 Year @ 7.5%', invested: 200000, currentValue: 215000, returns: 7.5, maturityDate: 'Dec 2026' },
      { name: 'FD - 3 Year @ 8.0%', invested: 150000, currentValue: 174000, returns: 8.0, maturityDate: 'Mar 2028' },
    ],
  },
]

export default function Investments() {
  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="investments-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investments</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage your investment portfolio</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Portfolio Analysis
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="portfolio-overview">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/20">
          <CardContent className="p-5">
            <p className="text-sm text-blue-100">Portfolio Value</p>
            <p className="text-2xl font-bold mt-1">₹{portfolioSummary.totalValue.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-300" />
              <span className="text-xs text-green-300 font-semibold">+₹{portfolioSummary.todayChange.toLocaleString()} today</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{portfolioSummary.invested.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Returns</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">+₹{portfolioSummary.returns.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">+{portfolioSummary.returnsPercent}% overall</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Today's Change</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">+₹{portfolioSummary.todayChange.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">+{portfolioSummary.todayChangePercent}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4" id="asset-allocation">
            <div className="flex-1 h-4 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 h-full" style={{ width: '43%' }} title="Mutual Funds" />
              <div className="bg-emerald-500 h-full" style={{ width: '27%' }} title="Stocks" />
              <div className="bg-purple-500 h-full" style={{ width: '30%' }} title="Fixed Deposits" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Mutual Funds (43%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">Stocks (27%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-600">Fixed Deposits (30%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings by Category */}
      {investments.map((category) => {
        const Icon = category.icon
        return (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>{category.holdings.length} holdings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm" id={`${category.category.toLowerCase().replace(' ', '-')}-table`}>
                  <thead>
                    <tr className="border-b border-border bg-gray-50/50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-500">Name</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">Invested</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">Current Value</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">P&L</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-500">Returns %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.holdings.map((h, i) => {
                      const pl = h.currentValue - h.invested
                      const isPositive = pl >= 0
                      return (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">{h.name}</td>
                          <td className="px-4 py-3 text-right text-gray-600">₹{h.invested.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{h.currentValue.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className={`flex items-center justify-end gap-1 font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                              {isPositive ? '+' : ''}₹{pl.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant={isPositive ? 'success' : 'destructive'}>
                              {isPositive ? '+' : ''}{h.returns}%
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
