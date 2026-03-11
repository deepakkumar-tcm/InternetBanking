import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useState } from 'react'

const initialNotifications = [
  { id: 1, type: 'success', title: 'Transfer Successful', message: '₹25,000 transferred to Priya Sharma', time: '2 min ago', read: false },
  { id: 2, type: 'warning', title: 'Bill Payment Due', message: 'Electricity bill of ₹1,850 due on 15th March', time: '1 hour ago', read: false },
  { id: 3, type: 'info', title: 'New Feature', message: 'UPI Autopay is now available for recurring payments', time: '3 hours ago', read: false },
  { id: 4, type: 'alert', title: 'Security Alert', message: 'New login detected from Chrome on Windows', time: '5 hours ago', read: true },
  { id: 5, type: 'success', title: 'FD Matured', message: 'Your Fixed Deposit of ₹2,00,000 has matured', time: '1 day ago', read: true },
]

const typeConfig = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  alert: { icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="space-y-2" id="notification-panel">
      {notifications.map((notification) => {
        const config = typeConfig[notification.type]
        const Icon = config.icon
        return (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              notification.read ? 'bg-white border-gray-100' : 'bg-blue-50/30 border-blue-100'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bg} flex-shrink-0 mt-0.5`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
              <p className="text-[11px] text-gray-400 mt-1">{notification.time}</p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No notifications</p>
        </div>
      )}
    </div>
  )
}
