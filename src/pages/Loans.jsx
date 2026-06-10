import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Plus as PlusFallback, Landmark, TrendingUp, Calendar, Info, CheckCircle2, FileText, Loader2, BarChart3, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'

const Plus = PlusFallback

const loanSummary = [
  { label: 'Total Outstanding', value: '₹28,50,000', icon: Landmark, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
  { label: 'Next Due (10 Apr)', value: '₹42,500', icon: Calendar, color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10' },
  { label: 'Accumulated Equity', value: '₹18,75,000', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
]

const initialLoans = [
  { id: 1, type: 'Home Loan', loanNo: 'HL-2024-001234', sanctioned: 4500000, outstanding: 2200000, emi: 35000, rate: 8.5, tenure: '20 years', startDate: 'Jan 2024', endDate: 'Jan 2044', paidPct: 51 },
  { id: 2, type: 'Personal Loan', loanNo: 'PL-2025-005678', sanctioned: 500000, outstanding: 350000, emi: 12500, rate: 12.0, tenure: '5 years', startDate: 'Jul 2025', endDate: 'Jul 2030', paidPct: 30 },
  { id: 3, type: 'Car Loan', loanNo: 'CL-2025-009012', sanctioned: 800000, outstanding: 300000, emi: 15000, rate: 9.5, tenure: '7 years', startDate: 'Mar 2025', endDate: 'Mar 2032', paidPct: 63 },
]

const emiSchedule = [
  { id: 1, loan: 'Home Loan Facility', emi: 35000, principal: 18500, interest: 16500, dueDate: '05 Apr 2026', status: 'Upcoming' },
  { id: 2, loan: 'Personal Credit Line', emi: 12500, principal: 8200, interest: 4300, dueDate: '10 Apr 2026', status: 'Upcoming' },
  { id: 3, loan: 'Vehicle Acquisition', emi: 15000, principal: 11500, interest: 3500, dueDate: '15 Apr 2026', status: 'Upcoming' },
  { id: 4, loan: 'Home Loan Facility', emi: 35000, principal: 18500, interest: 16500, dueDate: '05 Mar 2026', status: 'Paid' },
  { id: 5, loan: 'Personal Credit Line', emi: 12500, principal: 8200, interest: 4300, dueDate: '10 Mar 2026', status: 'Paid' },
]

export default function Loans() {
  const [requestOpen, setRequestOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const [loanForm, setLoanForm] = useState({ type: '', amount: '', tenure: '', purpose: '' })

  const [certificateOpen, setCertificateOpen] = useState(false)
  const [selectedLoanForCert, setSelectedLoanForCert] = useState(null)
  const [isCertLoading, setIsCertLoading] = useState(false)
  const [certReady, setCertReady] = useState(false)

  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [selectedLoanForAnalysis, setSelectedLoanForAnalysis] = useState(null)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
  }, [])

  const handleRequestFacility = () => {
    if (!loanForm.type || !loanForm.amount) {
      toast.error('Please fill in required fields')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setApplicationSuccess(true)
    }, 2000)
  }

  const closeRequestDialog = () => {
    setRequestOpen(false)
    setApplicationSuccess(false)
    setLoanForm({ type: '', amount: '', tenure: '', purpose: '' })
  }

  const handleCertificate = (loan) => {
    setSelectedLoanForCert(loan)
    setCertReady(false)
    setCertificateOpen(true)
    setIsCertLoading(true)
    setTimeout(() => {
      setIsCertLoading(false)
      setCertReady(true)
    }, 1800)
  }

  const downloadCertificate = () => {
    const loan = selectedLoanForCert
    const content = `LOAN CERTIFICATE\n================\n\nThis is to certify that:\n\nLoan Type: ${loan.type}\nLoan Account: ${loan.loanNo}\nSanctioned Amount: ₹${loan.sanctioned.toLocaleString()}\nOutstanding Balance: ₹${loan.outstanding.toLocaleString()}\nMonthly EMI: ₹${loan.emi.toLocaleString()}\nInterest Rate: ${loan.rate}% per annum\nTenure: ${loan.tenure}\nStart Date: ${loan.startDate}\nEnd Date: ${loan.endDate}\nRepayment Progress: ${loan.paidPct}%\n\nThis certificate is auto-generated.\nDate: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `loan_certificate_${loan.loanNo}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Certificate downloaded!')
    setCertificateOpen(false)
  }

  const handleAnalysis = (loan) => {
    setSelectedLoanForAnalysis(loan)
    setAnalysisOpen(true)
  }

  const handleExportPDF = () => {
    const headers = ['Loan', 'EMI', 'Principal', 'Interest', 'Due Date', 'Status']
    const rows = emiSchedule.map(e => [e.loan, e.emi, e.principal, e.interest, e.dueDate, e.status])
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'emi_schedule.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('EMI schedule exported!', { description: 'Saved as emi_schedule.csv' })
  }

  return (
    <div className="space-y-8 animate-fade-in" id="loans-page">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Credit & Liabilities</h2>
          <p className="text-sm text-muted-foreground font-medium italic">Manage your active credit facilities and repayment schedules</p>
        </div>
        <Button onClick={() => setRequestOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Request Facility
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="loan-summary">
        {loanSummary.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="border-border/50 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.color}`}><Icon className="h-7 w-7" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-black mt-1 truncate">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Loan Analytics — Resizable Panels */}
      <Card className="border-border/50 overflow-hidden" id="loan-analytics-panel">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold">Loan Analytics Dashboard</CardTitle>
          <p className="text-xs text-muted-foreground">Drag the handle to resize panels</p>
        </CardHeader>
        <ResizablePanelGroup direction="horizontal" id="loan-resizable-group" className="min-h-[200px]">
          <ResizablePanel defaultSize={50} minSize={30} id="panel-repayment">
            <div className="p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Repayment Efficiency</h3>
                <Badge className="bg-emerald-500 font-black text-[10px] border-none">OPTIMAL</Badge>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center -rotate-45 shrink-0">
                  <span className="rotate-45 font-black text-2xl text-emerald-600">98%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold">On-time Payment Score</p>
                  <p className="text-xs text-muted-foreground">0 missed EMIs in 24 months. Excellent credit standing.</p>
                  <Progress value={98} className="h-1.5" />
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle id="loan-resize-handle" />
          <ResizablePanel defaultSize={50} minSize={30} id="panel-alerts">
            <div className="p-6 h-full space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Intelligence Alerts</h3>
              <div className="flex gap-3 items-start p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-blue-700/80">Refinance Opportunity: Save ₹4,200/mo by switching to our 'Prime-7' scheme.</p>
              </div>
              <div className="flex gap-3 items-start p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-emerald-700/80">Zero processing fee on car loan part-payment this festive season.</p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>

      {/* Loan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="loan-cards">
        {initialLoans.map((loan) => (
          <Card key={loan.id} className="overflow-hidden border-border/50 group hover:shadow-2xl transition-all duration-500">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-6 text-white relative">
               <div className="absolute right-0 top-0 opacity-10 p-2"><Landmark className="h-24 w-24" /></div>
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{loan.type}</p>
                  <p className="text-3xl font-black mt-1">₹{loan.outstanding.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <Badge variant="outline" className="text-emerald-400 border-emerald-400/50 font-black mb-1">{loan.rate}% Fixed</Badge>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">INTEREST RATE</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agreement No</p>
                   <p className="font-mono text-xs font-bold">{loan.loanNo}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Installment</p>
                   <p className="text-sm font-black">₹{loan.emi.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Sanction</p>
                   <p className="text-sm font-bold">₹{loan.sanctioned.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenure Scale</p>
                   <p className="text-sm font-bold">{loan.tenure}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2" id={`loan-progress-${loan.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amortization</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest cursor-help">{loan.paidPct}% Repaid</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>₹{(loan.sanctioned * loan.paidPct / 100).toLocaleString()} repaid of ₹{loan.sanctioned.toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Progress value={loan.paidPct} className="h-2.5" />
              </div>

              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="flex-1 font-bold italic" onClick={() => handleCertificate(loan)}>Certificate</Button>
                 <Button size="sm" className="flex-1 font-bold" onClick={() => handleAnalysis(loan)}>Analysis</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collapsible EMI Schedule */}
      <Collapsible defaultOpen id="collapsible-emi-schedule">
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-lg font-bold">Comprehensive EMI Schedule</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px] h-8 border-2" onClick={handleExportPDF} id="btn-export-emi">
                <FileText className="h-3 w-3 mr-2" /> Export CSV
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" id="btn-toggle-emi">
                  <ChevronsUpDown className="h-4 w-4 mr-1" /> Toggle
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent id="emi-schedule-content">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                <TableHead className="text-xs uppercase tracking-widest font-black pl-8">Account Designation</TableHead>
                <TableHead className="text-xs uppercase tracking-widest font-black text-right">Total Installment</TableHead>
                <TableHead className="text-xs uppercase tracking-widest font-black text-right">Principal Applied</TableHead>
                <TableHead className="text-xs uppercase tracking-widest font-black text-right">Interest Service</TableHead>
                <TableHead className="text-xs uppercase tracking-widest font-black">Execution Date</TableHead>
                <TableHead className="text-xs uppercase tracking-widest font-black text-center pr-8">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emiSchedule.map((emi) => (
                <TableRow key={emi.id} className="hover:bg-muted/20 border-border/10 transition-colors cursor-pointer group">
                  <TableCell className="font-black text-sm pl-8 group-hover:text-primary">{emi.loan}</TableCell>
                  <TableCell className="text-right font-black">₹{emi.emi.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-bold">₹{emi.principal.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-bold">₹{emi.interest.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-bold font-mono">{emi.dueDate}</TableCell>
                  <TableCell className="text-center pr-8">
                    <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-wider py-1 px-3 ${emi.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}>
                       {emi.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Request Facility Dialog */}
      <Dialog open={requestOpen} onOpenChange={closeRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Request New Credit Facility</DialogTitle>
            <DialogDescription>Submit your loan application. We'll process it within 2-3 business days.</DialogDescription>
          </DialogHeader>
          {!applicationSuccess ? (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Loan Type <span className="text-red-500">*</span></Label>
                  <Select value={loanForm.type} onValueChange={v => setLoanForm({...loanForm, type: v})}>
                    <SelectTrigger><SelectValue placeholder="Select loan type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="car">Car Loan</SelectItem>
                      <SelectItem value="education">Education Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Amount (₹) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="e.g. 500000" value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Tenure</Label>
                    <Select value={loanForm.tenure} onValueChange={v => setLoanForm({...loanForm, tenure: v})}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1y">1 Year</SelectItem>
                        <SelectItem value="3y">3 Years</SelectItem>
                        <SelectItem value="5y">5 Years</SelectItem>
                        <SelectItem value="10y">10 Years</SelectItem>
                        <SelectItem value="20y">20 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Purpose</Label>
                  <Input placeholder="Brief purpose of the loan" value={loanForm.purpose} onChange={e => setLoanForm({...loanForm, purpose: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeRequestDialog} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleRequestFacility} disabled={isSubmitting} className="min-w-[160px]">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Application'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Application Received!</h3>
              <p className="text-sm text-muted-foreground">Your {loanForm.type} loan application for ₹{parseFloat(loanForm.amount || 0).toLocaleString()} has been submitted.</p>
              <p className="text-xs font-mono font-bold text-muted-foreground">Reference: LOAN-{Math.floor(Math.random()*900000+100000)}</p>
              <Button onClick={closeRequestDialog} className="mt-4 font-bold">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={certificateOpen} onOpenChange={setCertificateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Loan Certificate</DialogTitle>
            <DialogDescription>{selectedLoanForCert?.type} — {selectedLoanForCert?.loanNo}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isCertLoading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Generating your certificate...</p>
              </div>
            ) : certReady && selectedLoanForCert && (
              <div className="space-y-3 bg-muted/20 rounded-xl p-5 border border-dashed border-border">
                <p className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Certificate of Loan Status</p>
                {[
                  ['Loan Type', selectedLoanForCert.type],
                  ['Account No.', selectedLoanForCert.loanNo],
                  ['Sanctioned', `₹${selectedLoanForCert.sanctioned.toLocaleString()}`],
                  ['Outstanding', `₹${selectedLoanForCert.outstanding.toLocaleString()}`],
                  ['Monthly EMI', `₹${selectedLoanForCert.emi.toLocaleString()}`],
                  ['Interest Rate', `${selectedLoanForCert.rate}% p.a.`],
                  ['Repayment', `${selectedLoanForCert.paidPct}% Complete`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {certReady && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setCertificateOpen(false)} className="font-bold">Close</Button>
              <Button onClick={downloadCertificate} className="font-bold"><FileText className="h-4 w-4 mr-2" />Download Certificate</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />Loan Analysis
            </DialogTitle>
            <DialogDescription>{selectedLoanForAnalysis?.type} — Detailed Repayment Breakdown</DialogDescription>
          </DialogHeader>
          {selectedLoanForAnalysis && (
            <div className="space-y-5 py-2">
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Repayment Progress</span>
                  <span className="text-xs font-bold text-emerald-600">{selectedLoanForAnalysis.paidPct}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${selectedLoanForAnalysis.paidPct}%` }} />
                </div>
              </div>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Sanctioned', val: `₹${selectedLoanForAnalysis.sanctioned.toLocaleString()}`, color: 'text-blue-600' },
                  { label: 'Outstanding', val: `₹${selectedLoanForAnalysis.outstanding.toLocaleString()}`, color: 'text-red-600' },
                  { label: 'Amount Repaid', val: `₹${(selectedLoanForAnalysis.sanctioned - selectedLoanForAnalysis.outstanding).toLocaleString()}`, color: 'text-emerald-600' },
                  { label: 'Monthly EMI', val: `₹${selectedLoanForAnalysis.emi.toLocaleString()}`, color: 'text-purple-600' },
                  { label: 'Interest Rate', val: `${selectedLoanForAnalysis.rate}% p.a.`, color: 'text-amber-600' },
                  { label: 'Remaining Months', val: `${Math.round((selectedLoanForAnalysis.outstanding / selectedLoanForAnalysis.emi))} EMIs`, color: 'text-foreground' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-muted/20 rounded-xl border border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className={`text-lg font-black mt-1 ${item.color}`}>{item.val}</p>
                  </div>
                ))}
              </div>
              {/* Interest vs Principal */}
              <div className="p-4 bg-muted/10 rounded-xl border border-border/30">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Monthly EMI Breakdown</p>
                <div className="flex gap-2 h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${Math.round((selectedLoanForAnalysis.emi * 0.53)/ selectedLoanForAnalysis.emi * 100)}%` }} />
                  <div className="bg-amber-500 h-full flex-1" />
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold">
                  <span className="text-blue-600">Principal: ₹{Math.round(selectedLoanForAnalysis.emi * 0.53).toLocaleString()}</span>
                  <span className="text-amber-600">Interest: ₹{Math.round(selectedLoanForAnalysis.emi * 0.47).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalysisOpen(false)} className="font-bold">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
