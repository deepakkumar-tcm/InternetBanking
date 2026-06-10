import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown, LogOut, User, Settings as SettingsIcon, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

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
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] || 'Dashboard'
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  const notifications = [
    { id: 1, text: 'Transfer of ₹25,000 completed', time: '2 min ago', read: false },
    { id: 2, text: 'Bill payment reminder: Electricity', time: '1 hour ago', read: false },
    { id: 3, text: 'New login from Chrome on Windows', time: '3 hours ago', read: true },
    { id: 4, text: 'Credit card statement generated', time: '1 day ago', read: true },
  ]

  return (
    <header id="main-header" className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-8">
      {/* Page Title */}
      <div>
        <h1 id="page-title" className="text-xl font-bold tracking-tight">{title}</h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block" id="header-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="w-64 pl-9 bg-muted/40 border-muted focus:bg-background h-9 rounded-full"
            id="search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/transactions?search=${e.target.value}`)
              }
            }}
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            id="notification-bell"
            className="relative rounded-full hover:bg-muted"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center border-2 border-background">
              2
            </span>
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div id="notification-dropdown" className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-xs text-muted-foreground">You have 2 unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-muted hover:bg-muted/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                  >
                    <p className={`text-sm ${!n.read ? 'font-medium' : 'text-muted-foreground'}`}>{n.text}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-border">
                <Button variant="ghost" size="sm" className="w-full text-blue-600">View all notifications</Button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild id="user-profile">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex h-auto items-center gap-3 rounded-full border border-border/40 bg-muted/20 p-1 pl-3 text-sm font-medium outline-none hover:bg-muted/50 cursor-pointer transition-all active:scale-95 group shadow-sm"
            >
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold leading-none text-foreground" id="user-name">Rajesh Kumar</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-black">Gold Member</p>
              </div>
              <Avatar className="h-9 w-9 border border-background shadow-sm ring-1 ring-border/20 group-hover:ring-blue-500/30 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs">RK</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl">
            <DropdownMenuLabel className="px-3 pb-3">
               <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold">Rajesh Kumar</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Member ID: #7821-09</p>
               </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-xl h-10 px-3 hover:bg-blue-500/10 hover:text-blue-600 transition-colors">
              <User className="mr-2 h-4 w-4" />
              <span className="font-bold">Security Vault</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-xl h-10 px-3 hover:bg-blue-500/10 hover:text-blue-600 transition-colors">
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span className="font-bold">Privacy Matrix</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-xl h-10 px-3 hover:bg-blue-500/10 hover:text-blue-600 transition-colors">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span className="font-bold">Interface Prefs</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 font-black cursor-pointer rounded-xl h-10 px-3 hover:bg-red-500/10 transition-colors" id="header-logout">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="uppercase tracking-widest text-xs">Terminate Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

