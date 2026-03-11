import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const activities = [
  { id: 1, type: 'credit', description: 'Salary Credit - TechCorp', amount: 85000, time: '2 hours ago', icon: ArrowDownLeft, color: 'text-emerald-500 bg-emerald-50' },
  { id: 2, type: 'debit', description: 'Amazon Purchase', amount: 2499, time: '5 hours ago', icon: ArrowUpRight, color: 'text-red-500 bg-red-50' },
  { id: 3, type: 'debit', description: 'Electricity Bill - BESCOM', amount: 1850, time: '1 day ago', icon: ArrowUpRight, color: 'text-red-500 bg-red-50' },
  { id: 4, type: 'credit', description: 'Refund - Flipkart', amount: 799, time: '1 day ago', icon: ArrowDownLeft, color: 'text-emerald-500 bg-emerald-50' },
  { id: 5, type: 'debit', description: 'UPI - Swiggy', amount: 450, time: '2 days ago', icon: ArrowUpRight, color: 'text-red-500 bg-red-50' },
  { id: 6, type: 'debit', description: 'Netflix Subscription', amount: 649, time: '3 days ago', icon: ArrowUpRight, color: 'text-red-500 bg-red-50' },
  { id: 7, type: 'credit', description: 'Interest Credit', amount: 1250, time: '5 days ago', icon: ArrowDownLeft, color: 'text-emerald-500 bg-emerald-50' },
]

export default function ActivityFeed() {
  return (
    <div className="space-y-1" id="activity-feed">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.color} transition-transform duration-200 group-hover:scale-110`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{activity.description}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${activity.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
              {activity.type === 'credit' ? '+' : '-'}{formatCurrency(activity.amount)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
