import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight, Search, Clock, CheckCircle, AlertCircle, Loader2, Send, HeartHandshake, Shield, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

const faqs = [
  { id: 1, question: 'How to reset my Internet Banking password?', answer: 'Go to Settings > Security > Change Password. You will need your current password and OTP verification.' },
  { id: 2, question: 'How to add a new beneficiary?', answer: 'Navigate to Beneficiaries page and click "Add Beneficiary". Fill in the required details and verify with OTP.' },
  { id: 3, question: 'What are the NEFT/RTGS timings?', answer: 'NEFT operates 24x7 and settles in batches. RTGS is available from 7:00 AM to 6:00 PM on business days.' },
  { id: 4, question: 'How to freeze my debit card?', answer: 'Go to Cards page, find your card and click "Freeze Card". You can unfreeze it anytime.' },
  { id: 5, question: 'How to download account statement?', answer: 'Go to Accounts page, click on "View Statement" for the desired account. Choose date range and download.' },
  { id: 6, question: 'What is the daily UPI transfer limit?', answer: 'The default UPI daily limit is ₹1,00,000. You can modify it from Settings > Limits.' },
]

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickets, setTickets] = useState([
    { id: 'TKT-2026-0045', subject: 'Failed transaction refund not received', status: 'Open', priority: 'High', created: '10 Mar 2026', lastUpdate: '11 Mar 2026' },
    { id: 'TKT-2026-0038', subject: 'Update mobile number request', status: 'In Progress', priority: 'Medium', created: '08 Mar 2026', lastUpdate: '10 Mar 2026' },
    { id: 'TKT-2026-0029', subject: 'Credit card annual fee waiver', status: 'Resolved', priority: 'Low', created: '01 Mar 2026', lastUpdate: '05 Mar 2026' },
    { id: 'TKT-2026-0021', subject: 'Cheque book request', status: 'Resolved', priority: 'Low', created: '25 Feb 2026', lastUpdate: '28 Feb 2026' },
  ])

  const [form, setForm] = useState({ category: '', priority: '', subject: '', description: '' })

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState('')

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
  }, [])

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.subject || !form.description || !form.category) {
      toast.error('Please fill in the required fields')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const newTicket = {
        id: `TKT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        subject: form.subject,
        status: 'Open',
        priority: form.priority === 'low' ? 'Low' : form.priority === 'high' ? 'High' : 'Medium',
        created: 'Today',
        lastUpdate: 'Just now'
      }
      setTickets([newTicket, ...tickets])
      setIsSubmitting(false)
      setForm({ category: '', priority: '', subject: '', description: '' })
      toast.success('Support request submitted successfully!', {
        description: `Your ticket ${newTicket.id} has been created.`
      })
    }, 2000)
  }

  const handleSendChat = () => {
    if (!chatMsg.trim()) return
    toast.success('Message sent!', { description: 'An agent will respond shortly.' })
    setChatMsg('')
  }

  return (
    <div className="space-y-8 animate-fade-in" id="support-page">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Support Center</h2>
          <p className="text-sm text-muted-foreground">Expert assistance for all your banking queries</p>
        </div>
        <Button id="raise-ticket" onClick={() => document.getElementById('support-form-card')?.scrollIntoView({ behavior: 'smooth' })}>
          <MessageSquare className="h-4 w-4 mr-2" />Raise New Ticket
        </Button>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="contact-options">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm"><Phone className="h-6 w-6" /></div>
            <div><p className="text-sm font-bold">Call Assistance</p><p className="text-sm text-muted-foreground">1800-123-4567</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-border/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm"><Mail className="h-6 w-6" /></div>
            <div><p className="text-sm font-bold">Email Support</p><p className="text-sm text-muted-foreground">support@securebank.com</p></div>
          </CardContent>
        </Card>
        <Card onClick={() => setIsChatOpen(true)} className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-border/50 border-blue-500/10 bg-blue-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg"><MessageSquare className="h-6 w-6" /></div>
            <div><p className="text-sm font-bold">Live Portal Chat</p><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 animate-pulse">● Agents Online</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="kb" className="w-full" id="support-tabs">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kb" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FAQ */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-blue-600" /> FAQ & Guides
                </CardTitle>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="faq-search" placeholder="How can we help you today?" className="pl-9 h-11 rounded-full bg-muted/30 border-none focus-visible:ring-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Accordion type="single" collapsible className="w-full" id="faq-accordion">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-border/50">
                      <AccordionTrigger className="hover:no-underline py-4 px-2 hover:bg-muted/30 rounded-lg transition-colors">
                        <div className="flex items-center gap-3 text-left">
                          <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
                          <span className="text-sm font-bold tracking-tight">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-10 pb-4 text-sm text-muted-foreground leading-relaxed font-medium">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {filteredFaqs.length === 0 && <p className="text-center py-10 text-sm text-muted-foreground font-medium">No results found for your search.</p>}
                </Accordion>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card id="support-form-card" className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Raise New Case</CardTitle>
                <CardDescription className="font-medium">Submit your query to our specialized support teams.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" id="support-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="ticket-category" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Department</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                        <SelectTrigger id="ticket-category" className="h-10 bg-muted/30 border-none rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transaction">Transfers & UPI</SelectItem>
                          <SelectItem value="account">Account Management</SelectItem>
                          <SelectItem value="card">Cards & PINs</SelectItem>
                          <SelectItem value="technical">Website & App</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ticket-priority" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Urgency</Label>
                      <Select value={form.priority} onValueChange={(v) => setForm({...form, priority: v})}>
                        <SelectTrigger id="ticket-priority" className="h-10 bg-muted/30 border-none rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High (Urgent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-subject" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Brief Subject</Label>
                    <Input id="ticket-subject" placeholder="What is this regarding?" className="bg-muted/30 border-none rounded-xl h-10" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ticket-description" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Full Details</Label>
                    <Textarea id="ticket-description" placeholder="Explain your issue in detail..." className="min-h-[120px] bg-muted/30 border-none rounded-xl resize-none p-4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <Button id="submit-ticket" type="submit" disabled={isSubmitting} className="w-full h-12 font-black uppercase tracking-widest rounded-xl mt-2 transition-all hover:shadow-lg active:scale-[0.98]">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> DISPATCHING...</> : 'OPEN TICKET'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-0">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-border/10 bg-muted/5">
              <div>
                <CardTitle className="text-lg font-bold">My Service History</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{tickets.filter(t => t.status !== 'Resolved').length} Active Tickets</CardDescription>
              </div>
              <Button size="sm" variant="ghost" className="rounded-full"><Clock className="h-4 w-4 mr-2" /> Recent Update Only</Button>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <ScrollArea className="h-auto max-h-[500px]">
                <Table id="tickets-history-table">
                  <TableHeader>
                    <TableRow className="bg-muted/40 border-none">
                      <TableHead className="pl-6 text-[10px] uppercase tracking-widest font-black">Ticket ID</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black">Issue Description</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Urgency</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Status</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black pr-6">Last Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-muted/10 cursor-pointer border-border/10 transition-colors">
                        <TableCell className="font-mono text-xs text-blue-600 font-bold pl-6 select-all">{ticket.id}</TableCell>
                        <TableCell className="font-bold text-sm text-foreground">{ticket.subject}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={ticket.priority === 'High' ? 'bg-red-500/10 text-red-600 border-red-500/20 font-black text-[10px]' : ticket.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 font-black text-[10px]' : 'bg-slate-500/10 text-slate-600 border-slate-500/20 font-black text-[10px]'}>{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          <div className="flex items-center justify-center gap-1.5">
                            {ticket.status === 'Resolved' ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : ticket.status === 'Open' ? <AlertCircle className="h-3 w-3 text-blue-500" /> : <Clock className="h-3 w-3 text-amber-500 animate-pulse" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{ticket.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-bold font-mono pr-6">{ticket.lastUpdate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-80" />
              <h3 className="text-xl font-black italic tracking-tight">SecureChat Port</h3>
              <p className="text-xs opacity-80 font-medium">Verified Banking Executive Session</p>
           </div>
           <div className="p-4 bg-muted/20 min-h-[300px] flex flex-col justify-end">
              <div className="space-y-4 mb-4">
                 <div className="bg-blue-600 text-white text-xs p-3 rounded-2xl rounded-tr-none max-w-[80%] self-end ml-auto">
                    Hello, I have a query regarding my recent home loan application HL-2024-001234.
                 </div>
                 <div className="bg-white text-slate-800 text-xs p-3 rounded-2xl rounded-tl-none max-w-[80%] mr-auto shadow-sm border border-border/50">
                    <p className="font-bold text-[10px] text-blue-600 mb-1 uppercase tracking-widest">Agent Rajat</p>
                    Greetings! I'm Rajat. I can see your application is currently under "Credit Risk Assessment". Expect an update within 48 hours.
                 </div>
              </div>
              <div className="relative">
                 <Input 
                   placeholder="Type your message..." 
                   value={chatMsg} 
                   onChange={(e) => setChatMsg(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                   className="pr-12 h-12 rounded-full border-border/50 shadow-inner"
                 />
                 <Button size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full" onClick={handleSendChat}>
                    <Send className="h-4 w-4" />
                 </Button>
              </div>
           </div>
           <DialogFooter className="bg-muted/10 p-4 border-t">
              <p className="text-[9px] text-center w-full font-bold text-muted-foreground uppercase opacity-50 tracking-widest flex items-center justify-center gap-2">
                 <ShieldCheck className="h-3 w-3" /> End-to-End Encrypted Session
              </p>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
