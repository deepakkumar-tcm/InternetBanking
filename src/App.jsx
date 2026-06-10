import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Transfer from './pages/Transfer'
import BillPayments from './pages/BillPayments'
import Beneficiaries from './pages/Beneficiaries'
import Cards from './pages/Cards'
import Loans from './pages/Loans'
import Investments from './pages/Investments'
import Settings from './pages/Settings'
import Support from './pages/Support'
import Login from './pages/Login'


export default function App() {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')

  // Update auth state when storage or location changes (simulating simple auth middleware)
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
  }, [location])

  const isLoginPage = location.pathname === '/login'

  // Protected route logic
  if (!isLoggedIn && !isLoginPage) {
    return <Navigate to="/login" replace />
  }

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <Header />
        <main className="flex-1 px-8 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/bill-payments" element={<BillPayments />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
