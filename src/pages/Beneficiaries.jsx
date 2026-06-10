import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, CheckCircle, Loader2, ShieldCheck, Pencil, Trash2, Plus, Send, Building2, Clock, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'

const initialBeneficiaries = [
  { id: 1, name: 'Priya Sharma',  nickname: 'Priya',  bank: 'HDFC Bank',            branch: 'Koramangala', account: 'XXXX XXXX 3456', ifsc: 'HDFC0001234', type: 'NEFT', status: 'Verified', added: '01 Jan 2026', lastTransfer: '11 Mar 2026' },
  { id: 2, name: 'Amit Patel',    nickname: 'Amit',   bank: 'State Bank of India',  branch: 'MG Road',     account: 'XXXX XXXX 7890', ifsc: 'SBIN0005678', type: 'IMPS', status: 'Verified', added: '15 Feb 2026', lastTransfer: '10 Mar 2026' },
  { id: 3, name: 'Sunita Reddy',  nickname: 'Sunita', bank: 'ICICI Bank',           branch: 'Whitefield',  account: 'XXXX XXXX 2345', ifsc: 'ICIC0009012', type: 'UPI',  status: 'Verified', added: '20 Dec 2025', lastTransfer: '09 Mar 2026' },
  { id: 4, name: 'Vikram Singh',  nickname: 'Vikram', bank: 'Axis Bank',            branch: 'Indiranagar', account: 'XXXX XXXX 6789', ifsc: 'UTIB0003456', type: 'RTGS', status: 'Pending',  added: '05 Mar 2026', lastTransfer: 'Never' },
  { id: 5, name: 'Meera Joshi',   nickname: 'Meera',  bank: 'Kotak Mahindra',       branch: 'JP Nagar',    account: 'XXXX XXXX 4567', ifsc: 'KKBK0007890', type: 'NEFT', status: 'Verified', added: '10 Jan 2026', lastTransfer: '05 Mar 2026' },
  { id: 6, name: 'Rahul Gupta',   nickname: 'Rahul',  bank: 'Punjab National Bank', branch: 'BTM Layout',  account: 'XXXX XXXX 8901', ifsc: 'PUNB0001234', type: 'IMPS', status: 'Verified', added: '28 Feb 2026', lastTransfer: '08 Mar 2026' },
]
const emptyEdit = { name: '', nickname: '', bank: '', branch: '', ifsc: '', type: 'NEFT' }

const avatarColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-orange-600', 'bg-pink-600', 'bg-cyan-600']

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries)
  const [searchTerm, setSearchTerm]       = useState('')
  const [activeTab, setActiveTab]         = useState('all')
  const [dialogOpen, setDialogOpen]       = useState(false)
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [newBene, setNewBene]             = useState({ name: '', nickname: '', account: '', confirmAccount: '', ifsc: '' })
  const [editOpen, setEditOpen]           = useState(false)
  const [editingId, setEditingId]         = useState(null)
  const [editData, setEditData]           = useState(emptyEdit)
  const [verifyingId, setVerifyingId]     = useState(null)
  const [cmdOpen, setCmdOpen]             = useState(false)

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  const filtered = beneficiaries.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase())
      || b.bank.toLowerCase().includes(searchTerm.toLowerCase())
      || b.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTab = activeTab === 'all'
      || (activeTab === 'verified' && b.status === 'Verified')
      || (activeTab === 'pending' && b.status === 'Pending')
    return matchSearch && matchTab
  })

  const handleAddBeneficiary = () => {
    if (!newBene.name || !newBene.account || !newBene.ifsc) { toast.error('Fill in all required fields'); return }
    if (newBene.account !== newBene.confirmAccount) { toast.error('Account numbers do not match'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      setBeneficiaries(prev => [{
        id: Date.now(), name: newBene.name,
        nickname: newBene.nickname || newBene.name.split(' ')[0],
        bank: 'SecureBank (Local)', branch: 'Default',
        account: `XXXX XXXX ${newBene.account.slice(-4)}`,
        ifsc: newBene.ifsc, type: 'NEFT', status: 'Pending',
        added: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        lastTransfer: 'Never'
      }, ...prev])
      setIsSubmitting(false); setDialogOpen(false)
      setNewBene({ name: '', nickname: '', account: '', confirmAccount: '', ifsc: '' })
      toast.success('Beneficiary added successfully!')
    }, 1500)
  }

  const handleDelete = (id, name) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id))
    toast.success(`${name} removed from beneficiaries`)
  }

  const handleOpenEdit = (b) => {
    setEditingId(b.id)
    setEditData({ name: b.name, nickname: b.nickname, bank: b.bank, branch: b.branch, ifsc: b.ifsc, type: b.type })
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editData.name || !editData.bank || !editData.ifsc) { toast.error('Name, bank and IFSC are required'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      setBeneficiaries(prev => prev.map(b => b.id === editingId ? { ...b, ...editData } : b))
      setIsSubmitting(false); setEditOpen(false); setEditingId(null)
      toast.success('Beneficiary updated!')
    }, 1200)
  }

  const handleVerify = (id, name) => {
    setVerifyingId(id)
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, status: 'Verified' } : b))
        setVerifyingId(null); resolve()
      }, 2000)),
      { loading: `Verifying ${name}…`, success: `${name} verified!`, error: 'Verification failed.' }
    )
  }

  return (
    <div className="space-y-6 animate-fade-in" id="beneficiaries-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Beneficiaries</h2>
          <p className="text-sm text-muted-foreground">Manage saved beneficiaries for quick fund transfers</p>
        </div>
        <Button id="btn-add-beneficiary" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
        </Button>
      </div>

      {/* Command Search */}
      <Card className="border shadow-sm" id="beneficiary-command-search">
        <CardContent className="p-3">
          <Command className="rounded-lg border-0 shadow-none" shouldFilter={false}>
            <CommandInput
              id="beneficiary-cmd-input"
              placeholder="Quick search beneficiaries by name, bank or nickname…"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {searchTerm && (
              <CommandList id="beneficiary-cmd-list">
                <CommandEmpty>No beneficiaries found.</CommandEmpty>
                <CommandGroup heading="Matching Beneficiaries">
                  {filtered.slice(0, 5).map(b => (
                    <CommandItem key={b.id} id={`cmd-item-${b.id}`} onSelect={() => { toast.info(`Selected ${b.name}`); setSearchTerm('') }} className="cursor-pointer">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className={`text-white text-xs ${avatarColors[b.id % avatarColors.length]}`}>
                          {b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{b.name}</span>
                      <span className="ml-2 text-muted-foreground text-xs">· {b.bank}</span>
                      <Badge variant={b.status === 'Verified' ? 'outline' : 'secondary'} className="ml-auto text-[10px]">{b.status}</Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4" id="beneficiary-stats">
        {[
          { label: 'Total', value: beneficiaries.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Verified', value: beneficiaries.filter(b => b.status === 'Verified').length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pending', value: beneficiaries.filter(b => b.status === 'Pending').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        ].map((s, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs + Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} id="beneficiaries-tabs">
        <TabsList id="beneficiaries-tabslist" className="mb-4">
          <TabsTrigger value="all" id="tab-bene-all">All ({beneficiaries.length})</TabsTrigger>
          <TabsTrigger value="verified" id="tab-bene-verified">Verified ({beneficiaries.filter(b => b.status === 'Verified').length})</TabsTrigger>
          <TabsTrigger value="pending" id="tab-bene-pending">Pending ({beneficiaries.filter(b => b.status === 'Pending').length})</TabsTrigger>
        </TabsList>

        {['all', 'verified', 'pending'].map(tab => (
          <TabsContent key={tab} value={tab} id={`tab-content-bene-${tab}`}>
            <Card className="border shadow-sm">
              <ScrollArea className="h-auto">
                <Table id={`bene-table-${tab}`}>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="pl-6 text-xs uppercase tracking-widest font-bold">Beneficiary</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold">Bank</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold">Account</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold">IFSC</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold">Type</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold text-center">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-bold text-center pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((b, idx) => (
                      <TableRow key={b.id} id={`bene-row-${b.id}`} className="hover:bg-muted/30 transition-colors">
                        {/* Avatar + HoverCard */}
                        <TableCell className="pl-6">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-3 cursor-pointer group">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className={`text-white text-xs font-bold ${avatarColors[idx % avatarColors.length]}`}>
                                    {b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors">{b.name}</p>
                                  <p className="text-[11px] text-muted-foreground">{b.nickname}</p>
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64" id={`hovercard-bene-${b.id}`}>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className={`text-white font-bold ${avatarColors[idx % avatarColors.length]}`}>
                                      {b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-sm">{b.name}</p>
                                    <p className="text-xs text-muted-foreground">{b.bank}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-y-1 text-xs">
                                  <span className="text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> Branch:</span>
                                  <span className="font-medium">{b.branch}</span>
                                  <span className="text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Added:</span>
                                  <span className="font-medium">{b.added}</span>
                                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Last Transfer:</span>
                                  <span className="font-medium">{b.lastTransfer}</span>
                                </div>
                                <Button size="sm" className="w-full h-7 text-xs" onClick={() => toast.info(`Initiating transfer to ${b.name}`)}>
                                  <Send className="h-3 w-3 mr-1.5" /> Send Money
                                </Button>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell className="text-sm">{b.bank}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{b.account}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{b.ifsc}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{b.type}</Badge></TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={b.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-blue-600" onClick={() => handleOpenEdit(b)} id={`btn-edit-bene-${b.id}`}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            {b.status === 'Pending' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-emerald-600" onClick={() => handleVerify(b.id, b.name)} disabled={verifyingId === b.id} id={`btn-verify-bene-${b.id}`}>
                                    {verifyingId === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Verify Beneficiary</TooltipContent>
                              </Tooltip>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600" id={`btn-delete-bene-${b.id}`}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent id={`alert-delete-bene-${b.id}`}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove {b.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove <strong>{b.name}</strong> ({b.bank} · {b.account}) from your saved beneficiaries. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel id={`btn-cancel-delete-bene-${b.id}`}>Keep</AlertDialogCancel>
                                  <AlertDialogAction id={`btn-confirm-delete-bene-${b.id}`} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => handleDelete(b.id, b.name)}>
                                    Yes, Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No beneficiaries found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Beneficiary</DialogTitle>
            <DialogDescription>Enter the beneficiary's bank account details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { id: 'bene-name', label: 'Full Name *', placeholder: 'Enter full name', key: 'name' },
              { id: 'bene-nickname', label: 'Nickname', placeholder: "e.g. 'Dad', 'Landlord'", key: 'nickname' },
              { id: 'bene-account', label: 'Account Number *', placeholder: 'Account number', key: 'account' },
              { id: 'bene-confirm', label: 'Confirm Account *', placeholder: 'Re-enter account number', key: 'confirmAccount' },
              { id: 'bene-ifsc', label: 'IFSC Code *', placeholder: 'e.g. HDFC0001234', key: 'ifsc' },
            ].map(field => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="text-xs font-bold uppercase tracking-widest">{field.label}</Label>
                <Input id={field.id} placeholder={field.placeholder} value={newBene[field.key]} onChange={e => setNewBene({ ...newBene, [field.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting} id="btn-cancel-add-bene">Cancel</Button>
            <Button id="btn-save-beneficiary" onClick={handleAddBeneficiary} disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…</> : 'Add Beneficiary'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Beneficiary</DialogTitle>
            <DialogDescription>Update the details of this beneficiary.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Full Name</Label>
                <Input id="edit-bene-name" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Nickname</Label>
                <Input id="edit-bene-nickname" value={editData.nickname} onChange={e => setEditData({ ...editData, nickname: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Bank Name</Label>
                <Input id="edit-bene-bank" value={editData.bank} onChange={e => setEditData({ ...editData, bank: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Transfer Type</Label>
                <Select value={editData.type} onValueChange={v => setEditData({ ...editData, type: v })}>
                  <SelectTrigger id="edit-bene-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['NEFT', 'IMPS', 'RTGS', 'UPI'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest">IFSC Code</Label>
              <Input id="edit-bene-ifsc" value={editData.ifsc} onChange={e => setEditData({ ...editData, ifsc: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSubmitting} id="btn-cancel-edit-bene">Cancel</Button>
            <Button id="btn-save-edit-bene" onClick={handleSaveEdit} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
