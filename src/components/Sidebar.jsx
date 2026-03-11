import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Landmark, ArrowLeftRight, SendHorizonal, Receipt,
  Users, CreditCard, Building2, TrendingUp, HelpCircle, Settings, Shield
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', path: '/accounts', icon: Landmark },
  { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { label: 'Transfer Money', path: '/transfer', icon: SendHorizonal },
  { label: 'Bill Payments', path: '/bill-payments', icon: Receipt },
  { label: 'Beneficiaries', path: '/beneficiaries', icon: Users },
  { label: 'Cards', path: '/cards', icon: CreditCard },
  { label: 'Loans', path: '/loans', icon: Building2 },
  { label: 'Investments', path: '/investments', icon: TrendingUp },
  { label: 'Support', path: '/support', icon: HelpCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-[260px] overflow-y-auto border-r border-gray-800 bg-sidebar-bg flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">SecureBank</h1>
          <p className="text-[11px] text-gray-500 font-medium">Internet Banking</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" id="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              id={`nav-${item.path.replace('/', '')}`}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-sidebar-active text-sidebar-text-active shadow-sm shadow-blue-500/10'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-gray-200'
                }
              `}
            >
              <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-dot" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-800/50">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Rajesh Kumar</p>
            <p className="text-[11px] text-gray-500 truncate">Premium Account</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
