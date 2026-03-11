import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings, Shield, Wifi } from 'lucide-react'

const cards = [
  {
    id: 1,
    type: 'Debit Card',
    name: 'SecureBank Platinum Debit',
    number: '**** **** **** 4521',
    expiry: '09/28',
    holder: 'RAJESH KUMAR',
    network: 'Visa',
    status: 'Active',
    frozen: false,
    limit: { daily: 200000, used: 15000 },
    color: 'from-gray-800 via-gray-900 to-black',
  },
  {
    id: 2,
    type: 'Credit Card',
    name: 'SecureBank Rewards Credit',
    number: '**** **** **** 8765',
    expiry: '12/27',
    holder: 'RAJESH KUMAR',
    network: 'Mastercard',
    status: 'Active',
    frozen: false,
    limit: { total: 500000, used: 125000 },
    color: 'from-blue-700 via-blue-800 to-indigo-900',
  },
  {
    id: 3,
    type: 'Credit Card',
    name: 'SecureBank Business Credit',
    number: '**** **** **** 3456',
    expiry: '06/29',
    holder: 'RAJESH KUMAR',
    network: 'Visa',
    status: 'Active',
    frozen: true,
    limit: { total: 1000000, used: 230000 },
    color: 'from-purple-700 via-purple-800 to-violet-900',
  },
]

const recentCardTxns = [
  { id: 1, card: '****4521', merchant: 'Amazon.in', amount: 2499, date: '10 Mar 2026', type: 'Debit' },
  { id: 2, card: '****8765', merchant: 'Flipkart', amount: 5999, date: '09 Mar 2026', type: 'Credit' },
  { id: 3, card: '****4521', merchant: 'Swiggy', amount: 450, date: '09 Mar 2026', type: 'Debit' },
  { id: 4, card: '****8765', merchant: 'BigBasket', amount: 2340, date: '08 Mar 2026', type: 'Credit' },
  { id: 5, card: '****3456', merchant: 'Udemy', amount: 449, date: '07 Mar 2026', type: 'Credit' },
]

export default function Cards() {
  const [showPin, setShowPin] = useState({})
  const [cardStates, setCardStates] = useState(
    cards.reduce((acc, c) => ({ ...acc, [c.id]: { frozen: c.frozen } }), {})
  )

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  const toggleFreeze = (id) => {
    setCardStates(prev => ({
      ...prev,
      [id]: { ...prev[id], frozen: !prev[id].frozen }
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in" id="cards-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your debit and credit cards</p>
        </div>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Apply for New Card
        </Button>
      </div>

      {/* Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="space-y-4">
            {/* Visual Card */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 aspect-[1.6/1] flex flex-col justify-between ${cardStates[card.id]?.frozen ? 'opacity-60' : ''}`}>
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white/70">{card.type}</p>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-5 w-5 text-white/70 rotate-90" />
                  </div>
                </div>
                <p className="text-sm font-medium text-white/80 mt-1">{card.name}</p>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-10 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-400/50" />
                </div>
                <p className="text-lg font-mono tracking-[0.2em] text-white/90">{card.number}</p>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/50 uppercase">Card Holder</p>
                  <p className="text-sm font-semibold">{card.holder}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase">Expires</p>
                  <p className="text-sm font-semibold">{card.expiry}</p>
                </div>
                <p className="text-lg font-bold italic text-white/80">{card.network}</p>
              </div>

              {cardStates[card.id]?.frozen && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center z-20">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-semibold">Card Frozen</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={cardStates[card.id]?.frozen ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => toggleFreeze(card.id)}
                id={`freeze-card-${card.id}`}
              >
                {cardStates[card.id]?.frozen ? <Unlock className="h-3.5 w-3.5 mr-1.5" /> : <Lock className="h-3.5 w-3.5 mr-1.5" />}
                {cardStates[card.id]?.frozen ? 'Unfreeze' : 'Freeze Card'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowPin(p => ({ ...p, [card.id]: !p[card.id] }))}
                id={`view-pin-${card.id}`}
              >
                {showPin[card.id] ? <EyeOff className="h-3.5 w-3.5 mr-1.5" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
                {showPin[card.id] ? 'Hide PIN' : 'View PIN'}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>

            {showPin[card.id] && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">PIN: ****</span>
                  <span className="text-xs text-amber-600">(OTP required to view full PIN)</span>
                </div>
              </div>
            )}

            {/* Card Limits */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Limits</p>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{card.type === 'Credit Card' ? 'Credit Limit' : 'Daily Limit'}</span>
                    <span className="font-semibold text-gray-900">₹{(card.limit.total || card.limit.daily).toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${((card.limit.used) / (card.limit.total || card.limit.daily)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Used: ₹{card.limit.used.toLocaleString()}</span>
                    <span>Available: ₹{((card.limit.total || card.limit.daily) - card.limit.used).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Card Transactions */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Recent Card Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm" id="card-transactions-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Card</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Merchant</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Type</th>
                </tr>
              </thead>
              <tbody>
                {recentCardTxns.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{txn.card}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{txn.merchant}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{txn.date}</td>
                    <td className="px-4 py-3 text-center"><Badge variant="secondary">{txn.type}</Badge></td>
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
