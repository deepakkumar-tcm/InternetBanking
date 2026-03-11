import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit2, Trash2, MoreHorizontal, UserPlus } from 'lucide-react'

const beneficiaries = [
  { id: 1, name: 'Priya Sharma', accountNumber: 'XXXX XXXX 7890', bank: 'HDFC Bank', ifsc: 'HDFC0001234', type: 'NEFT/RTGS', addedOn: '15 Jan 2026', status: 'Active', avatar: 'PS' },
  { id: 2, name: 'Amit Patel', accountNumber: 'XXXX XXXX 4567', bank: 'State Bank of India', ifsc: 'SBIN0009876', type: 'NEFT/RTGS', addedOn: '20 Dec 2025', status: 'Active', avatar: 'AP' },
  { id: 3, name: 'Sunita Reddy', accountNumber: 'XXXX XXXX 2345', bank: 'ICICI Bank', ifsc: 'ICIC0005432', type: 'NEFT/RTGS', addedOn: '05 Nov 2025', status: 'Active', avatar: 'SR' },
  { id: 4, name: 'Vikram Singh', accountNumber: 'XXXX XXXX 8901', bank: 'Axis Bank', ifsc: 'UTIB0003456', type: 'NEFT/RTGS', addedOn: '10 Oct 2025', status: 'Active', avatar: 'VS' },
  { id: 5, name: 'Neha Gupta', accountNumber: 'XXXX XXXX 6789', bank: 'Kotak Mahindra Bank', ifsc: 'KKBK0007890', type: 'NEFT/RTGS', addedOn: '22 Sep 2025', status: 'Inactive', avatar: 'NG' },
  { id: 6, name: 'Ravi Krishnan', accountNumber: 'XXXX XXXX 3456', bank: 'Bank of Baroda', ifsc: 'BARB0001234', type: 'NEFT', addedOn: '18 Aug 2025', status: 'Active', avatar: 'RK' },
  { id: 7, name: 'Meera Iyer', accountNumber: 'XXXX XXXX 5678', bank: 'Canara Bank', ifsc: 'CNRB0004567', type: 'NEFT', addedOn: '01 Jul 2025', status: 'Active', avatar: 'MI' },
  { id: 8, name: 'TechCorp Pvt Ltd', accountNumber: 'XXXX XXXX 1122', bank: 'HDFC Bank', ifsc: 'HDFC0005678', type: 'RTGS', addedOn: '15 Jun 2025', status: 'Active', avatar: 'TC' },
]

const avatarColors = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-600',
  'from-lime-500 to-green-600',
]

export default function Beneficiaries() {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bank.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in" id="beneficiaries-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Beneficiaries</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your saved beneficiaries for quick transfers</p>
        </div>
        <Button id="add-beneficiary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Beneficiaries</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{beneficiaries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{beneficiaries.filter(b => b.status === 'Active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Inactive</p>
            <p className="text-2xl font-bold text-gray-400 mt-1">{beneficiaries.filter(b => b.status === 'Inactive').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="beneficiary-search"
          placeholder="Search beneficiaries by name or bank..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Beneficiaries Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm" id="beneficiaries-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Account Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Bank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">IFSC</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, index) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                          {b.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{b.name}</p>
                          <p className="text-xs text-gray-400">Added {b.addedOn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.accountNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{b.bank}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.ifsc}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{b.type}</Badge></td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={b.status === 'Active' ? 'success' : 'secondary'}>{b.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
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
