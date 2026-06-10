import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Landmark, ArrowLeftRight, SendHorizontal, Receipt,
  Users, CreditCard, Building2, TrendingUp, HelpCircle, Settings, Shield, LogOut, ArrowUpCircle,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', path: '/accounts', icon: Landmark },
  { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { label: 'Transfer Money', path: '/transfer', icon: SendHorizontal },
  { label: 'Bill Payments', path: '/bill-payments', icon: Receipt },
  { label: 'Beneficiaries', path: '/beneficiaries', icon: Users },
  { label: 'Cards', path: '/cards', icon: CreditCard },
  { label: 'Credit Limit', path: '/credit-limit', icon: ArrowUpCircle, indent: true },
  { label: 'Loans', path: '/loans', icon: Building2 },
  { label: 'Investments', path: '/investments', icon: TrendingUp },
]

const bottomNavItems = [
  { label: 'Support', path: '/support', icon: HelpCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-[260px] overflow-y-auto border-r border-border bg-[#0a0f1c] flex flex-col"
    >
      {/* ... logo section omitted for brevity ... */}
      <div 
        className="flex items-center gap-3 px-6 py-7 cursor-pointer" 
        onClick={() => navigate('/dashboard')}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-none">SecureBank</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1.5 opacity-80">Internet Banking</p>
        </div>
      </div>

      <Separator className="bg-white/5 mx-6 w-auto" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1" id="sidebar-nav">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              id={`nav-${item.path.replace(/\//g, '').replace(/-/g, '')}`}
              className={`
                flex items-center gap-3 rounded-xl font-medium
                transition-all duration-200 group relative
                ${item.indent ? 'ml-5 px-3 py-2 text-[12px]' : 'px-4 py-2.5 text-[13px]'}
                ${isActive
                  ? 'bg-blue-600/10 text-white border border-blue-500/20 shadow-lg shadow-blue-500/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                }
              `}
            >
              {item.indent && <span className="text-slate-600 text-[10px] leading-none">└</span>}
              <Icon className={`transition-colors duration-200 ${item.indent ? 'h-[15px] w-[15px]' : 'h-[18px] w-[18px]'} ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </Link>
          )
        })}

        <div className="pt-3 pb-2">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Support & Settings</p>
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                id={`nav-${item.path.replace('/', '')}`}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-600/10 text-white border border-blue-500/20 shadow-lg shadow-blue-500/5'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent'
                  }
                `}
              >
                <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer / User Profile */}
      <div className="px-5 py-6 mt-auto">
        <div className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              RK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Rajesh Kumar</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider">Premium Plus</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              id="sidebar-logout"
              className="text-slate-500 hover:text-red-400 transition-colors p-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-emerald-500/10 blur-2xl rounded-full" />
        </div>
      </div>
    </aside>
  )
}

