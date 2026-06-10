import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PaymentForm from '@/components/PaymentForm'
import { Info, CheckCircle2, ArrowRight, Download, Share2, Plus, Archive, History, ShieldCheck, Loader2, Send, ShieldEllipsis } from 'lucide-react'
import { toast } from 'sonner'

const initialRecentTransfers = [
  { id: 'TXN-9021', to: 'Priya Sharma', bank: 'HDFC Bank', amount: 25000, date: '11 Mar 2026', type: 'NEFT', status: 'Completed' },
  { id: 'TXN-8734', to: 'Amit Patel', bank: 'SBI', amount: 15000, date: '10 Mar 2026', type: 'IMPS', status: 'Completed' },
  { id: 'TXN-2341', to: 'Sunita Reddy', bank: 'ICICI Bank', amount: 8000, date: '09 Mar 2026', type: 'UPI', status: 'Processing' },
  { id: 'TXN-1102', to: 'Vikram Singh', bank: 'Axis Bank', amount: 32000, date: '08 Mar 2026', type: 'RTGS', status: 'Completed' },
]

const archiveTransfers = [
  ...initialRecentTransfers,
  { id: 'TXN-0891', to: 'Meera Joshi', bank: 'Kotak Mahindra', amount: 12000, date: '05 Mar 2026', type: 'NEFT', status: 'Completed' },
  { id: 'TXN-0754', to: 'Rahul Gupta', bank: 'PNB', amount: 7500, date: '03 Mar 2026', type: 'IMPS', status: 'Completed' },
  { id: 'TXN-0623', to: 'Priya Sharma', bank: 'HDFC Bank', amount: 18000, date: '28 Feb 2026', type: 'NEFT', status: 'Completed' },
  { id: 'TXN-0512', to: 'Amit Patel', bank: 'SBI', amount: 5000, date: '25 Feb 2026', type: 'UPI', status: 'Completed' },
  { id: 'TXN-0401', to: 'Vikram Singh', bank: 'Axis Bank', amount: 45000, date: '20 Feb 2026', type: 'RTGS', status: 'Completed' },
  { id: 'TXN-0330', to: 'Sunita Reddy', bank: 'ICICI Bank', amount: 9800, date: '15 Feb 2026', type: 'NEFT', status: 'Completed' },
]

export default function Transfer() {
  const navigate = useNavigate()
  const [recentTransfers, setRecentTransfers] = useState(initialRecentTransfers)
  const [successData, setSuccessData] = useState(null)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [allArchive, setAllArchive] = useState(archiveTransfers)
  const [activeStep, setActiveStep] = useState('details')
  const [pinValue, setPinValue] = useState('')
  const [formPayload, setFormPayload] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
  }, [])

  const handleFormSubmit = (data) => {
    setFormPayload(data)
    setActiveStep('security')
  }

  const handleFinalConfirm = () => {
    if (pinValue.length < 6) {
      toast.error('Please enter 6-digit transaction PIN')
      return
    }
    
    setIsProcessing(true)
    setTimeout(() => {
      const data = formPayload
      const newTxn = {
        id: data.id || `TXN-${Math.floor(Math.random() * 9000 + 1000)}`,
        to: data.beneficiary,
        bank: 'Verified Bank',
        amount: parseFloat(data.amount),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: data.transferType,
        status: 'Completed'
      }
      setRecentTransfers(prev => [newTxn, ...prev])
      setAllArchive(prev => [newTxn, ...prev])
      setSuccessData(data)
      setIsProcessing(false)
      setActiveStep('success')
      toast.success('Funds Transferred Successfully')
    }, 2000)
  }

  const resetProcess = () => {
    setSuccessData(null)
    setFormPayload(null)
    setPinValue('')
    setActiveStep('details')
  }

  return (
    <div className="space-y-8 animate-fade-in" id="transfer-page">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Funds Transfer</h2>
          <p className="text-sm text-muted-foreground font-medium italic">Swiftly move money between accounts or to third parties</p>
        </div>
        <Drawer open={archiveOpen} onOpenChange={setArchiveOpen}>
           <DrawerTrigger asChild>
             <Button variant="outline" size="sm" id="btn-view-archive">
               <History className="h-4 w-4 mr-2" /> Execution Ledger
             </Button>
           </DrawerTrigger>
           <DrawerContent id="drawer-archive">
             <div className="mx-auto w-full max-w-4xl">
               <DrawerHeader>
                 <DrawerTitle className="text-xl font-bold">Comprehensive Execution Ledger</DrawerTitle>
                 <DrawerDescription>Full history of all outbound fund transfers from your accounts.</DrawerDescription>
               </DrawerHeader>
               <div className="p-4 overflow-hidden">
                 <ScrollArea className="h-[400px] rounded-md border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                          <TableHead className="font-bold">Date</TableHead>
                          <TableHead className="font-bold">To Beneficiary</TableHead>
                          <TableHead className="font-bold">Transaction Type</TableHead>
                          <TableHead className="font-bold text-right">Amount (₹)</TableHead>
                          <TableHead className="font-bold text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allArchive.map((t) => (
                          <TableRow key={t.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-xs font-mono">{t.date}</TableCell>
                            <TableCell>
                              <div className="font-bold text-sm text-foreground">{t.to}</div>
                              <div className="text-[10px] text-muted-foreground uppercase">{t.bank}</div>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="text-[10px]">{t.type}</Badge></TableCell>
                            <TableCell className="text-right font-black">₹{t.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={t.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}>{t.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </ScrollArea>
               </div>
               <DrawerFooter>
                 <DrawerClose asChild>
                   <Button variant="outline">Close Ledger</Button>
                 </DrawerClose>
               </DrawerFooter>
             </div>
           </DrawerContent>
        </Drawer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="border-border/50 shadow-lg overflow-hidden">
             <Tabs value={activeStep} className="w-full">
               <CardHeader className="border-b bg-muted/5 py-4">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/20">
                    <TabsTrigger value="details" onClick={() => activeStep === 'details' && null} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 text-xs font-bold uppercase tracking-tight">1. Details</TabsTrigger>
                    <TabsTrigger value="security" disabled={!formPayload} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 text-xs font-bold uppercase tracking-tight">2. Security</TabsTrigger>
                    <TabsTrigger value="success" disabled={!successData} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 text-xs font-bold uppercase tracking-tight">3. Success</TabsTrigger>
                  </TabsList>
               </CardHeader>
               
               <TabsContent value="details" className="mt-0">
                  <CardContent className="pt-6">
                    <PaymentForm onComplete={handleFormSubmit} />
                  </CardContent>
               </TabsContent>
               
               <TabsContent value="security" className="mt-0">
                  <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
                       <ShieldEllipsis className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Transaction Authentication</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">Enter your 6-digit secure transaction PIN to authorize this transfer.</p>
                    </div>
                    
                    <div className="space-y-4">
                       <InputOTP maxLength={6} value={pinValue} onChange={setPinValue} id="transaction-pin">
                         <InputOTPGroup>
                           <InputOTPSlot index={0} />
                           <InputOTPSlot index={1} />
                           <InputOTPSlot index={2} />
                         </InputOTPGroup>
                         <InputOTPSeparator />
                         <InputOTPGroup>
                           <InputOTPSlot index={3} />
                           <InputOTPSlot index={4} />
                           <InputOTPSlot index={5} />
                         </InputOTPGroup>
                       </InputOTP>
                       <div className="flex justify-center gap-4 pt-4">
                         <Button variant="outline" onClick={() => setActiveStep('details')}>Back</Button>
                         <Button onClick={handleFinalConfirm} disabled={isProcessing} className="min-w-[120px]">
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            {isProcessing ? 'Verifying...' : 'Authorize'}
                         </Button>
                       </div>
                    </div>
                  </CardContent>
               </TabsContent>
               
               <TabsContent value="success" className="mt-0">
                  <CardContent className="pt-12 pb-12 flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                       <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-black">Transfer Successful!</h3>
                    <div className="bg-muted/30 rounded-xl p-6 w-full max-w-sm border border-border/50">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recipient</span>
                          <span className="text-sm font-black">{successData?.beneficiary}</span>
                       </div>
                       <Separator className="mb-4" />
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount Dispatched</span>
                          <span className="text-lg font-black text-emerald-600">₹{parseFloat(successData?.amount || 0).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Instruction Ref</span>
                          <span className="text-xs font-mono font-bold">{successData?.id || 'TXN-0000'}</span>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-6">
                       <Button variant="outline" className="font-bold" onClick={() => toast.info('Receipt shared!')}><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                       <Button variant="outline" className="font-bold" onClick={() => toast.success('Downloaded!')}><Download className="h-4 w-4 mr-2" /> Receipt</Button>
                       <Button onClick={resetProcess} className="font-black">Done</Button>
                    </div>
                  </CardContent>
               </TabsContent>
             </Tabs>
           </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-border/50 overflow-hidden">
             <CardHeader className="bg-muted/5 border-b py-3 px-6">
               <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y">
                 {recentTransfers.map((txn) => (
                   <div key={txn.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">{txn.to}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{txn.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-foreground">₹{txn.amount.toLocaleString()}</p>
                         <p className="text-[9px] font-bold text-emerald-600 uppercase">Paid</p>
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
           
           <Card className="border-blue-500/20 bg-blue-500/5 overflow-hidden">
             <CardContent className="p-6 space-y-4">
               <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                  <Info className="h-6 w-6" />
               </div>
               <h4 className="font-black text-sm uppercase tracking-widest text-blue-700">Security Guard</h4>
               <p className="text-xs font-medium text-blue-700/80 leading-relaxed">
                 All transfers are protected by ISO 20022 message standard. We will never ask for your PIN via SMS.
               </p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
