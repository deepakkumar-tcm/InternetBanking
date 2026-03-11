import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/transactions': 'Transactions',
  '/transfer': 'Transfer Money',
  '/bill-payments': 'Bill Payments',
  '/beneficiaries': 'Beneficiaries',
  '/cards': 'Cards',
  '/loans': 'Loans',
  '/investments': 'Investments',
  '/settings': 'Settings',
  '/support': 'Support',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: 'Transfer of ₹25,000 completed', time: '2 min ago', read: false },
    { id: 2, text: 'Bill payment reminder: Electricity', time: '1 hour ago', read: false },
    { id: 3, text: 'New login from Chrome on Windows', time: '3 hours ago', read: true },
    { id: 4, text: 'Credit card statement generated', time: '1 day ago', read: true },
  ]

  return (
    <header id="main-header" className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-6">
      {/* Page Title */}
      <div>
        <h1 id="page-title" className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative" id="header-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search transactions, accounts..."
            className="w-72 pl-9 bg-gray-50 border-gray-200 focus:bg-white"
            id="search-input"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            id="notification-bell"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div id="notification-dropdown" className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-white shadow-xl animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">You have 2 unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <p className={`text-sm ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200" id="user-profile">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            RK
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900" id="user-name">Rajesh Kumar</p>
            <p className="text-[11px] text-gray-500">A/C: XXXX4521</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  )
}
