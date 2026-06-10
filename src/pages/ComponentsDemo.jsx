import { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  ResizableHandle, ResizablePanel, ResizablePanelGroup
} from '@/components/ui/resizable'
import {
  AlertCircle, CheckCircle2, ChevronsUpDown, Info, Shield, TrendingUp, Wallet,
  CreditCard, DollarSign, Users, Bell, Star, Globe, Lock, ChevronRight,
  ArrowRight, RefreshCw, Download, Upload, PlusCircle
} from 'lucide-react'

const SectionTitle = ({ title, count }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
    {count && <Badge variant="secondary" className="text-xs">{count} variants</Badge>}
  </div>
)

export default function ComponentsDemo() {
  const [progress, setProgress] = useState(45)
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  useEffect(() => {
    console.log('[ROUTE] Current path:', window.location.pathname)
    console.log('[ROUTE] Navigation state:', window.history.state)
    const timer = setInterval(() => {
      setProgress(p => (p >= 95 ? 20 : p + 5))
    }, 800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div id="components-demo-page" className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Components Demo</h1>
          <p className="text-muted-foreground mt-1.5">All shadcn/ui components demonstrated with banking context</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge id="demo-status-badge" variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            <CheckCircle2 className="h-3 w-3 mr-1" /> All Components Active
          </Badge>
        </div>
      </div>

      {/* ─── ACCORDION ─── */}
      <section id="section-accordion">
        <SectionTitle title="Accordion" count="3 items" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full" id="banking-faq-accordion">
              <AccordionItem value="item-1" id="faq-item-1">
                <AccordionTrigger className="text-sm font-medium">How do I transfer funds between accounts?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Navigate to Transfer Money, select your source and destination accounts, enter the amount and a reference note, then confirm with your transaction PIN. Transfers between internal accounts are instant and fee-free.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" id="faq-item-2">
                <AccordionTrigger className="text-sm font-medium">What are the daily transaction limits?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Standard accounts have a ₹2,00,000 daily limit for NEFT and ₹5,00,000 for RTGS. Premium Plus customers enjoy ₹10,00,000 daily limits across all modes. Contact support to request a temporary limit increase.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" id="faq-item-3">
                <AccordionTrigger className="text-sm font-medium">How do I set up automatic bill payments?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Go to Bill Payments → Manage Billers → Add New Biller. Enter the biller details and set recurrence (monthly, quarterly). Your account will be debited automatically on the scheduled date.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* ─── ALERTS ─── */}
      <section id="section-alerts">
        <SectionTitle title="Alerts" count="4 variants" />
        <div className="space-y-3" id="alerts-container">
          <Alert id="alert-info" className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Account Verification Required</AlertTitle>
            <AlertDescription className="text-blue-700">
              Complete your KYC verification to unlock higher transaction limits and premium features.
            </AlertDescription>
          </Alert>

          <Alert id="alert-success" className="border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Transfer Successful</AlertTitle>
            <AlertDescription className="text-emerald-700">
              ₹15,000 has been successfully transferred to HDFC Account ending in 4521. Reference: TXN20240312001.
            </AlertDescription>
          </Alert>

          <Alert id="alert-warning" className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Low Balance Warning</AlertTitle>
            <AlertDescription className="text-amber-700">
              Your Savings Account balance is below the minimum threshold of ₹10,000. Please add funds to avoid charges.
            </AlertDescription>
          </Alert>

          <Alert id="alert-destructive" variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Security Alert</AlertTitle>
            <AlertDescription>
              A login was detected from a new device in Mumbai. If this wasn't you, please block your account immediately.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* ─── ALERT DIALOG ─── */}
      <section id="section-alert-dialog">
        <SectionTitle title="Alert Dialog" count="2 examples" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex flex-wrap gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button id="btn-delete-account-trigger" variant="destructive">
                  <Shield className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent id="delete-account-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account, remove all banking data, and cancel all active services.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel id="btn-cancel-delete">Cancel</AlertDialogCancel>
                  <AlertDialogAction id="btn-confirm-delete" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button id="btn-close-card-trigger" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" /> Block Card
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent id="block-card-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Block Credit Card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Blocking your card will immediately stop all transactions. You can unblock it anytime from the Cards section. Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel id="btn-cancel-block">Cancel</AlertDialogCancel>
                  <AlertDialogAction id="btn-confirm-block">Block Card</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </section>

      {/* ─── ASPECT RATIO ─── */}
      <section id="section-aspect-ratio">
        <SectionTitle title="Aspect Ratio" count="2 variants" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">16:9 Banner</CardTitle>
            </CardHeader>
            <AspectRatio ratio={16 / 9} className="bg-gradient-to-br from-blue-600 to-indigo-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white font-bold text-xl">Premium Banking</p>
              </div>
            </AspectRatio>
          </Card>
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">4:3 Card Banner</CardTitle>
            </CardHeader>
            <div className="w-full max-w-[300px] mx-auto">
              <AspectRatio ratio={4 / 3} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white font-bold text-lg">Secure Account</p>
                </div>
              </AspectRatio>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── CAROUSEL ─── */}
      <section id="section-carousel">
        <SectionTitle title="Carousel" count="3 slides" />
        <Card className="border shadow-sm">
          <CardContent className="pt-10 pb-10 px-12">
            <Carousel className="w-full max-w-xl mx-auto" id="promo-carousel">
              <CarouselContent>
                {[
                  { title: "Unlimited Cashback", desc: "Get 5% cashback on all international spends.", bg: "from-blue-500 to-indigo-600" },
                  { title: "Zero Forex Markup", desc: "Pay in any currency without additional fees.", bg: "from-emerald-500 to-teal-600" },
                  { title: "Airport Lounge Access", desc: "Enjoy complimentary access to 1000+ lounges.", bg: "from-violet-500 to-purple-600" }
                ].map((item, i) => (
                  <CarouselItem key={i}>
                    <div className={`p-8 rounded-2xl bg-gradient-to-br ${item.bg} text-white h-48 flex flex-col justify-center`}>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-white/90">{item.desc}</p>
                      <Button variant="secondary" className="mt-4 w-fit" size="sm">Learn More</Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </section>

      {/* ─── CHART ─── */}
      <section id="section-chart">
        <SectionTitle title="Chart" />
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Monthly Expenditure</CardTitle>
            <CardDescription>Comparison of spends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ amount: { label: "Spent Amount", color: "hsl(var(--primary))" } }}
              className="h-[300px] w-full"
            >
              <BarChart data={[
                { month: 'Oct', amount: 45000 },
                { month: 'Nov', amount: 52000 },
                { month: 'Dec', amount: 38000 },
                { month: 'Jan', amount: 61000 },
                { month: 'Feb', amount: 48000 },
                { month: 'Mar', amount: 55000 },
              ]}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* ─── BREADCRUMBS ─── */}
      <section id="section-breadcrumbs">
        <SectionTitle title="Breadcrumb" count="2 variants" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/accounts">Accounts</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Transaction History</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>
      </section>

      {/* ─── RESIZABLE ─── */}
      <section id="section-resizable">
        <SectionTitle title="Resizable" />
        <Card className="border shadow-sm overflow-hidden h-[300px]">
          <ResizablePanelGroup direction="horizontal" className="min-h-[300px] w-full rounded-lg border">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6 bg-slate-50">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Navigation</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={25}>
                  <div className="flex h-full items-center justify-center p-6 bg-white">
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Header</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                  <div className="flex h-full items-center justify-center p-6 bg-slate-50">
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Content Area</span>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6 bg-white">
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">Details</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Card>
      </section>

      {/* ─── AVATAR ─── */}
      <section id="section-avatars">
        <SectionTitle title="Avatar" count="6 sizes" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-6" id="avatar-group">
              {[
                { initials: 'RK', label: 'Rajesh Kumar', color: 'from-emerald-400 to-teal-600' },
                { initials: 'PA', label: 'Priya Anand', color: 'from-violet-400 to-purple-600' },
                { initials: 'SK', label: 'Suresh K.', color: 'from-orange-400 to-red-500' },
                { initials: 'AM', label: 'Asha Mehta', color: 'from-pink-400 to-rose-600' },
                { initials: 'VT', label: 'Vikram T.', color: 'from-blue-400 to-indigo-600' },
              ].map((user, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Avatar id={`avatar-${i}`} className="h-14 w-14">
                    <AvatarImage src="" />
                    <AvatarFallback className={`bg-gradient-to-br ${user.color} text-white font-bold text-lg`}>
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground text-center">{user.label}</span>
                </div>
              ))}

              <div className="ml-4 flex flex-col items-center gap-2">
                <div className="flex -space-x-3" id="avatar-stack">
                  {['from-blue-400 to-indigo-600', 'from-emerald-400 to-teal-600', 'from-violet-400 to-purple-600', 'from-orange-400 to-red-500'].map((color, i) => (
                    <Avatar key={i} className="h-10 w-10 border-2 border-background">
                      <AvatarFallback className={`bg-gradient-to-br ${color} text-white text-xs font-bold`}>
                        {['RK', 'PA', 'SK', 'AM'][i]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground">+8</div>
                </div>
                <span className="text-xs text-muted-foreground">Team members</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── BADGES ─── */}
      <section id="section-badges">
        <SectionTitle title="Badge" count="8 variants" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3" id="badges-container">
              <Badge id="badge-default">Default</Badge>
              <Badge id="badge-secondary" variant="secondary">Secondary</Badge>
              <Badge id="badge-outline" variant="outline">Outline</Badge>
              <Badge id="badge-destructive" variant="destructive">Destructive</Badge>
              <Badge id="badge-success" className="bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100">Success</Badge>
              <Badge id="badge-warning" className="bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100">Warning</Badge>
              <Badge id="badge-info" className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-100">Info</Badge>
              <Badge id="badge-premium" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">Premium Plus</Badge>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-wrap gap-3" id="status-badges">
              {[
                { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'Failed', cls: 'bg-red-50 text-red-700 border-red-200' },
                { label: 'Verified', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: 'Premium', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
              ].map(({ label, cls }) => (
                <Badge key={label} variant="outline" id={`status-badge-${label.toLowerCase()}`} className={cls}>
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── BUTTONS ─── */}
      <section id="section-buttons">
        <SectionTitle title="Button" count="10 variants" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-3" id="button-variants">
              <Button id="btn-default">Default</Button>
              <Button id="btn-secondary" variant="secondary">Secondary</Button>
              <Button id="btn-outline" variant="outline">Outline</Button>
              <Button id="btn-ghost" variant="ghost">Ghost</Button>
              <Button id="btn-link" variant="link">Link</Button>
              <Button id="btn-destructive" variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-3" id="button-sizes">
              <Button id="btn-sm" size="sm">Small</Button>
              <Button id="btn-md" size="default">Default</Button>
              <Button id="btn-lg" size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3" id="button-icons">
              <Button id="btn-transfer" className="bg-blue-600 hover:bg-blue-700">
                <ArrowRight className="h-4 w-4 mr-2" /> Transfer
              </Button>
              <Button id="btn-download" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Statement
              </Button>
              <Button id="btn-topup" className="bg-emerald-600 hover:bg-emerald-700">
                <Upload className="h-4 w-4 mr-2" /> Top Up
              </Button>
              <Button id="btn-add-biller" variant="outline" className="border-dashed">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Biller
              </Button>
              <Button id="btn-disabled" disabled>
                <Lock className="h-4 w-4 mr-2" /> Locked
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── CARDS ─── */}
      <section id="section-cards">
        <SectionTitle title="Card" count="4 styles" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="cards-grid">
          {[
            { title: 'Total Balance', value: '₹4,52,340', desc: 'Across all accounts', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', chg: '+8.2%' },
            { title: 'Monthly Spend', value: '₹28,450', desc: 'vs ₹32,100 last month', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', chg: '-11.4%' },
            { title: 'Active Cards', value: '3', desc: '2 Credit · 1 Debit', icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50', chg: '0 new' },
            { title: 'Total Members', value: '7', desc: 'Family banking group', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', chg: '+2 added' },
          ].map((item, i) => (
            <Card key={i} id={`stat-card-${i}`} className="border shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">{item.chg}</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm font-medium text-foreground/80 mt-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card id="featured-card" className="mt-4 border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Premium Banking Card</CardTitle>
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            </div>
            <CardDescription className="text-blue-200">Unlimited cashback & airport lounge access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xl tracking-widest opacity-90">•••• •••• •••• 4521</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-blue-200">
            <span>Rajesh Kumar</span>
            <span>Exp: 09/27</span>
            <span>Visa Platinum</span>
          </CardFooter>
        </Card>
      </section>

      {/* ─── COLLAPSIBLE ─── */}
      <section id="section-collapsible">
        <SectionTitle title="Collapsible" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} id="account-details-collapsible">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Account Details</p>
                  <p className="text-xs text-muted-foreground">Savings Account ending in 4521</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button id="btn-collapsible-toggle" variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 mt-2">
                {[
                  ['IFSC Code', 'SBIN0012345'],
                  ['Branch', 'MG Road, Bangalore'],
                  ['Account Type', 'Savings - Premium'],
                  ['Opening Date', '15 March 2019'],
                  ['Nominee', 'Priya Rajesh'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between px-4 py-2.5 rounded-lg border text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </section>

      {/* ─── HOVER CARD ─── */}
      <section id="section-hover-card">
        <SectionTitle title="Hover Card" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex gap-4 flex-wrap">
            {[
              { name: 'Rajesh Kumar', role: 'Premium Plus', funds: '₹4,52,340', color: 'from-emerald-400 to-teal-600' },
              { name: 'Priya Anand', role: 'Standard', funds: '₹1,20,000', color: 'from-violet-400 to-purple-600' },
              { name: 'Suresh Kumar', role: 'Premium', funds: '₹2,89,000', color: 'from-blue-400 to-indigo-600' },
            ].map((user, i) => (
              <HoverCard key={i}>
                <HoverCardTrigger asChild>
                  <Button id={`hover-card-trigger-${i}`} variant="outline" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`bg-gradient-to-br ${user.color} text-white text-xs`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" id={`hover-card-content-${i}`}>
                  <div className="flex gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className={`bg-gradient-to-br ${user.color} text-white font-bold text-lg`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-semibold">{user.name}</p>
                      <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                      <p className="text-sm text-muted-foreground">Total Funds</p>
                      <p className="text-lg font-bold text-primary">{user.funds}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ─── POPOVER ─── */}
      <section id="section-popover">
        <SectionTitle title="Popover" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex gap-4 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button id="btn-quick-transfer-popover" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" /> Quick Transfer
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" id="quick-transfer-popover-content">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Quick Transfer</h4>
                  <div className="space-y-2">
                    {[
                      { to: 'Priya Anand', acct: '•••• 3421', color: 'from-violet-400 to-purple-600' },
                      { to: 'Family Account', acct: '•••• 8832', color: 'from-orange-400 to-red-500' },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`bg-gradient-to-br ${item.color} text-white text-xs`}>{item.to[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.to}</p>
                          <p className="text-xs text-muted-foreground">{item.acct}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button id="btn-notifications-popover" variant="outline">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
                  <Badge className="ml-2 h-4 px-1.5 text-[10px]">3</Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" id="notifications-popover-content">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {[
                    { title: 'EMI Deducted', msg: 'Home loan EMI of ₹22,000 deducted', time: '2 min ago' },
                    { title: 'Transfer Received', msg: '₹5,000 from Priya Anand', time: '1 hr ago' },
                    { title: 'Card Alert', msg: 'Transaction of ₹1,299 at Amazon', time: '3 hr ago' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.msg}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </section>

      {/* ─── PROGRESS ─── */}
      <section id="section-progress">
        <SectionTitle title="Progress" count="5 indicators" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-5" id="progress-container">
            {[
              { label: 'Credit Card Limit Used', value: 62, desc: '₹62,000 of ₹1,00,000' },
              { label: 'Savings Goal – House', value: progress, desc: 'Animated progress' },
              { label: 'Loan Repaid', value: 78, desc: '₹7.8L of ₹10L paid' },
              { label: 'Investment Target', value: 45, desc: '₹4.5L of ₹10L invested' },
              { label: 'Profile Completion', value: 90, desc: '9 of 10 steps done' },
            ].map((item, i) => (
              <div key={i} id={`progress-${i}`} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ─── SKELETON ─── */}
      <section id="section-skeleton">
        <SectionTitle title="Skeleton" count="3 layouts" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="skeleton-container">
          {[0, 1, 2].map(i => (
            <Card key={i} id={`skeleton-card-${i}`} className="border shadow-sm">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── TOOLTIP ─── */}
      <section id="section-tooltip">
        <SectionTitle title="Tooltip" count="6 items" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex gap-4 flex-wrap" id="tooltip-container">
            {[
              { label: 'Transfer', tip: 'Instantly transfer funds between accounts', icon: ArrowRight },
              { label: 'Download', tip: 'Download monthly bank statement as PDF', icon: Download },
              { label: 'Refresh', tip: 'Sync latest transactions from the server', icon: RefreshCw },
              { label: 'Notifications', tip: '3 new alerts waiting for your review', icon: Bell },
              { label: 'Verified', tip: 'Your account is KYC verified and secure', icon: Shield },
              { label: 'Globe', tip: 'International wire transfer options', icon: Globe },
            ].map(({ label, tip, icon: Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button id={`tooltip-btn-${label.toLowerCase()}`} variant="outline" size="sm" className="gap-2">
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent id={`tooltip-content-${label.toLowerCase()}`}>
                  <p className="text-xs">{tip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ─── TYPOGRAPHY ─── */}
      <section id="section-typography">
        <SectionTitle title="Typography" />
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4" id="typography-container">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">SecureBank Online</h1>
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight border-b pb-2">Account Overview</h2>
            <h3 className="scroll-m-20 text-xl font-semibold">Transaction History</h3>
            <h4 className="scroll-m-20 text-base font-semibold text-muted-foreground">Recent Transfers • March 2024</h4>
            <p className="leading-7 text-sm text-foreground/80">
              Your funds are protected by industry-leading 256-bit SSL encryption. All transactions are monitored in real-time by our AI fraud detection system.
            </p>
            <p className="text-sm text-muted-foreground">
              SecureBank is regulated by the Reserve Bank of India (RBI). Deposits up to ₹5,00,000 are insured under the DICGC scheme.
            </p>
            <div className="flex gap-3 flex-wrap">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">TXN20240312-001</code>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">ACCT-4521-SBIN</code>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">IFSC: SBIN0012345</code>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
