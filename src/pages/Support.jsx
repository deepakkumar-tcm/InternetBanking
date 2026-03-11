import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { HelpCircle, MessageSquare, Phone, Mail, FileText, ChevronRight, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const faqs = [
  { id: 1, question: 'How to reset my Internet Banking password?', answer: 'Go to Settings > Security > Change Password. You will need your current password and OTP verification.' },
  { id: 2, question: 'How to add a new beneficiary?', answer: 'Navigate to Beneficiaries page and click "Add Beneficiary". Fill in the required details and verify with OTP.' },
  { id: 3, question: 'What are the NEFT/RTGS timings?', answer: 'NEFT operates 24x7 and settles in batches. RTGS is available from 7:00 AM to 6:00 PM on business days.' },
  { id: 4, question: 'How to freeze my debit card?', answer: 'Go to Cards page, find your card and click "Freeze Card". You can unfreeze it anytime.' },
  { id: 5, question: 'How to download account statement?', answer: 'Go to Accounts page, click on "View Statement" for the desired account. Choose date range and download.' },
  { id: 6, question: 'What is the daily UPI transfer limit?', answer: 'The default UPI daily limit is ₹1,00,000. You can modify it from Settings > Limits.' },
]

const tickets = [
  { id: 'TKT-2026-0045', subject: 'Failed transaction refund not received', status: 'Open', priority: 'High', created: '10 Mar 2026', lastUpdate: '11 Mar 2026' },
  { id: 'TKT-2026-0038', subject: 'Update mobile number request', status: 'In Progress', priority: 'Medium', created: '08 Mar 2026', lastUpdate: '10 Mar 2026' },
  { id: 'TKT-2026-0029', subject: 'Credit card annual fee waiver', status: 'Resolved', priority: 'Low', created: '01 Mar 2026', lastUpdate: '05 Mar 2026' },
  { id: 'TKT-2026-0021', subject: 'Cheque book request', status: 'Resolved', priority: 'Low', created: '25 Feb 2026', lastUpdate: '28 Feb 2026' },
]

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in" id="support-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support</h2>
          <p className="text-sm text-gray-500 mt-1">Get help with your banking needs</p>
        </div>
        <Button id="raise-ticket">
          <MessageSquare className="h-4 w-4 mr-2" />
          Raise New Ticket
        </Button>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="contact-options">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-110">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Call Us</p>
              <p className="text-sm text-gray-500">1800-123-4567</p>
              <p className="text-xs text-gray-400">24x7 Toll Free</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-110">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Email Us</p>
              <p className="text-sm text-gray-500">support@securebank.com</p>
              <p className="text-xs text-gray-400">Response within 24 hrs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform duration-200 group-hover:scale-110">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Live Chat</p>
              <p className="text-sm text-gray-500">Chat with our agents</p>
              <p className="text-xs text-emerald-500 font-medium">● Online now</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <div className="relative max-w-md mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="faq-search"
              placeholder="Search FAQs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" id="faq-list">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-border rounded-lg overflow-hidden transition-all duration-200"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 pl-11 animate-fade-in">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raise Ticket Form */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Submit a Support Request</CardTitle>
          <CardDescription>Describe your issue and our team will get back to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" id="support-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="ticket-category">Category</label>
                <Select>
                  <SelectTrigger id="ticket-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">Transaction Issue</SelectItem>
                    <SelectItem value="account">Account Related</SelectItem>
                    <SelectItem value="card">Card Issue</SelectItem>
                    <SelectItem value="loan">Loan Query</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="ticket-priority">Priority</label>
                <Select>
                  <SelectTrigger id="ticket-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="ticket-subject">Subject</label>
              <Input id="ticket-subject" placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="ticket-description">Description</label>
              <textarea
                id="ticket-description"
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="ticket-attachment">Attachment</label>
              <Input id="ticket-attachment" type="file" />
            </div>
            <Button id="submit-ticket">Submit Request</Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Tickets */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Support Tickets</CardTitle>
          <Badge variant="info">{tickets.filter(t => t.status !== 'Resolved').length} active</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm" id="tickets-table">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Ticket ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Subject</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Priority</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Created</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 font-semibold">{ticket.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{ticket.subject}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={ticket.priority === 'High' ? 'destructive' : ticket.priority === 'Medium' ? 'warning' : 'secondary'}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Open' ? 'info' : 'warning'}>
                        {ticket.status === 'Resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {ticket.status === 'Open' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {ticket.status === 'In Progress' && <Clock className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ticket.created}</td>
                    <td className="px-4 py-3 text-gray-600">{ticket.lastUpdate}</td>
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
