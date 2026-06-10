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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TrendingUp, TrendingDown, BarChart3, PieChart, DollarSign, ArrowUpRight, Plus, ExternalLink, RefreshCcw, Download, Loader2, CheckCircle2, Lightbulb, Info } from 'lucide-react'
import { toast } from 'sonner'

const portfolioSummary = {
  totalValue: 1250000, invested: 1100000, returns: 150000, returnsPercent: 13.6,
  todayChange: 4500, todayChangePercent: 0.36,
}

const initialInvestments = [
  {
    id: 1, category: 'Mutual Funds', icon: PieChart, color: 'from-blue-500 to-indigo-600',
    holdings: [
      { name: 'HDFC Flexi Cap Fund', invested: 200000, currentValue: 245000, returns: 22.5 },
      { name: 'SBI Small Cap Fund', invested: 150000, currentValue: 185000, returns: 23.3 },
      { name: 'Axis Bluechip Fund', invested: 100000, currentValue: 112000, returns: 12.0 },
    ],
  },
  {
    id: 2, category: 'Stocks', icon: BarChart3, color: 'from-emerald-500 to-teal-600',
    holdings: [
      { name: 'Reliance Industries', invested: 100000, currentValue: 128000, returns: 28.0 },
      { name: 'TCS', invested: 80000, currentValue: 92000, returns: 15.0 },
      { name: 'Infosys', invested: 70000, currentValue: 65000, returns: -7.1 },
      { name: 'HDFC Bank', invested: 50000, currentValue: 58000, returns: 16.0 },
    ],
  },
  {
    id: 3, category: 'Fixed Deposits', icon: DollarSign, color: 'from-purple-500 to-violet-600',
    holdings: [
      { name: 'FD - 1 Year @ 7.5%', invested: 200000, currentValue: 215000, returns: 7.5 },
      { name: 'FD - 3 Year @ 8.0%', invested: 150000, currentValue: 174000, returns: 8.0 },
    ],
  },
]

const insightCards = [
  {
    badge: 'ADVISORY', badgeColor: 'bg-amber-500', icon: '📊',
    title: 'Tax Harvesting Opportunity',
    desc: 'Realize ₹15k in long-term capital losses to offset current year\'s tax liability.',
    detail: 'Your Infosys holding is currently at -7.1% returns. By selling it now, you can book ₹3,500 in capital losses which offset your gains from HDFC Flexi Cap. This reduces your taxable LTCG by ₹15,000.',
  },
  {
    badge: 'NEW FUND', badgeColor: 'bg-blue-500', icon: '🚀',
    title: 'Quantum AI NFO Live',
    desc: 'Direct exposure to semiconductor and global AI infrastructure. Subscription closes Mar 25.',
    detail: 'Quantum AI is a thematic NFO investing in global semiconductor companies and AI infrastructure. Minimum SIP: ₹500. NFO Period: Mar 10 - Mar 25, 2026. Expected NAV at allotment: ₹10.',
  },
]

export default function Investments() {
  const [investments, setInvestments] = useState(initialInvestments)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [syncedValues, setSyncedValues] = useState({})

  const [newAssetOpen, setNewAssetOpen] = useState(false)
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [assetForm, setAssetForm] = useState({ category: '', name: '', invested: '', currentValue: '' })
  const [assetSuccess, setAssetSuccess] = useState(false)

  const [insightOpen, setInsightOpen] = useState(false)
  const [activeInsight, setActiveInsight] = useState(null)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      // Create slightly randomized sync values for display
      const newSynced = {}
      initialInvestments.forEach(cat => {
        cat.holdings.forEach(h => {
          const variance = (Math.random() - 0.4) * 0.02 // -0.8% to +1.2% random change
          newSynced[h.name] = h.currentValue * (1 + variance)
        })
      })
      setSyncedValues(newSynced)
      setIsRefreshing(false)
      toast.success('Market data updated', {
        description: 'Your portfolio values have been refreshed with latest NAV and stock prices.'
      })
    }, 1800)
  }

  const handleAddAsset = () => {
    if (!assetForm.category || !assetForm.name || !assetForm.invested) {
      toast.error('Please fill in all required fields')
      return
    }
    setIsAddingAsset(true)
    setTimeout(() => {
      const newHolding = {
        name: assetForm.name,
        invested: parseFloat(assetForm.invested),
        currentValue: parseFloat(assetForm.currentValue || assetForm.invested),
        returns: assetForm.currentValue && assetForm.invested
          ? parseFloat((((parseFloat(assetForm.currentValue) - parseFloat(assetForm.invested)) / parseFloat(assetForm.invested)) * 100).toFixed(1))
          : 0
      }
      setInvestments(prev => prev.map(cat =>
        cat.category === assetForm.category
          ? { ...cat, holdings: [newHolding, ...cat.holdings] }
          : cat
      ))
      setIsAddingAsset(false)
      setAssetSuccess(true)
    }, 1500)
  }

  const closeAssetDialog = () => {
    setNewAssetOpen(false)
    setAssetSuccess(false)
    setAssetForm({ category: '', name: '', invested: '', currentValue: '' })
  }

  const handleExportData = (category, holdings) => {
    const headers = ['Instrument', 'Invested (₹)', 'Current Value (₹)', 'P&L (₹)', 'Returns (%)']
    const rows = holdings.map(h => {
      const pl = (syncedValues[h.name] || h.currentValue) - h.invested
      return [h.name, h.invested, (syncedValues[h.name] || h.currentValue).toFixed(0), pl.toFixed(0), h.returns]
    })
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${category.replace(/ /g, '_')}_portfolio.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success(`${category} data exported!`)
  }

  const openInsight = (insight) => {
    setActiveInsight(insight)
    setInsightOpen(true)
  }

  return (
    <div className="space-y-8 animate-fade-in" id="investments-page">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Portfolio Management</h2>
          <p className="text-sm text-muted-foreground font-medium italic">Comprehensive view of your wealth distribution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Prices
          </Button>
          <Button size="sm" onClick={() => setNewAssetOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Asset</Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="portfolio-overview">
        <Card className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white border-0 shadow-2xl shadow-blue-500/30 overflow-hidden relative">
           <div className="absolute -right-4 -top-4 bg-white/10 h-24 w-24 rounded-full blur-2xl" />
          <CardContent className="p-6 relative">
            <p className="text-[10px] uppercase font-black tracking-widest text-blue-100/60">Consolidated Value</p>
            <p className="text-3xl font-black mt-2">₹{portfolioSummary.totalValue.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-4 bg-white/10 w-fit px-2 py-1 rounded-lg">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">+₹{portfolioSummary.todayChange.toLocaleString()} (0.36%)</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Capital Invested</p>
            <p className="text-2xl font-bold mt-2">₹{portfolioSummary.invested.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-emerald-500/5">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60">Net Accumulation</p>
            <p className="text-2xl font-black text-emerald-600 mt-2">+₹{portfolioSummary.returns.toLocaleString()}</p>
            <Badge className="bg-emerald-500 text-[10px] mt-2 border-none">CAGR: +13.6%</Badge>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Portfolio Alpha</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Alpha measures the excess return relative to the benchmark index (Nifty 50).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3 mt-3">
               <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
               </div>
               <div>
                  <p className="text-xl font-bold">1.24</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Beat Nifty 50</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="w-full" id="investments-main-tabs">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="portfolio" id="tab-portfolio">Active Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist" id="tab-watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="analytics" id="tab-analytics">Deep Analytics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="portfolio" className="space-y-8 mt-0">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Allocation */}
        <Card className="lg:col-span-1 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Capital Distribution</CardTitle>
            <CardDescription className="font-medium">Balanced according to low-risk profile</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6" id="asset-allocation">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                <span>MF</span>
                <span>Equity</span>
                <span>FD</span>
              </div>
              <div className="h-6 rounded-2xl overflow-hidden flex shadow-inner ring-1 ring-border/20">
                <div className="bg-blue-500 h-full hover:brightness-110 transition-all cursor-help" style={{ width: '43%' }} />
                <div className="bg-emerald-500 h-full hover:brightness-110 transition-all cursor-help" style={{ width: '27%' }} />
                <div className="bg-purple-500 h-full hover:brightness-110 transition-all cursor-help" style={{ width: '30%' }} />
              </div>
            </div>
            <div className="space-y-4">
               {[
                  { label: 'Mutual Funds', val: '43%', color: 'bg-blue-500', pct: 43 },
                  { label: 'Equity Markets', val: '27%', color: 'bg-emerald-500', pct: 27 },
                  { label: 'Term Deposits', val: '30%', color: 'bg-purple-500', pct: 30 }
               ].map((item) => (
                  <div key={item.label} className="space-y-1 group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className={`h-2 w-2 rounded-full ${item.color}`} />
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="font-black text-xs">{item.val}</span>
                     </div>
                     <Progress value={item.pct} className="h-1" />
                  </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategic Portfolio Insights */}
        <Card className="lg:col-span-2 border-border/50 overflow-hidden">
           <CardHeader className="pb-4 border-b border-border/10">
              <CardTitle className="text-lg font-bold">Strategic Portfolio Insights</CardTitle>
           </CardHeader>
           <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {insightCards.map((insight, i) => (
                   <div
                     key={i}
                     className="p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors cursor-pointer group"
                     onClick={() => openInsight(insight)}
                   >
                     <div className="flex justify-between items-start mb-4">
                        <Badge className={`${insight.badgeColor} border-none font-bold text-[10px]`}>{insight.badge}</Badge>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                     </div>
                     <p className="text-sm font-bold tracking-tight">{insight.title}</p>
                     <p className="text-[11px] text-muted-foreground font-medium mt-1">{insight.desc}</p>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      {investments.map((category) => {
        const Icon = category.icon
        return (
          <Card key={category.id} className="border-border/50 overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/10 bg-muted/10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-xl ring-4 ring-background`}>
                     <Icon className="h-6 w-6 text-white" />
                   </div>
                   <div>
                     <CardTitle className="text-lg font-bold">{category.category}</CardTitle>
                     <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{category.holdings.length} Active Positions</CardDescription>
                   </div>
                 </div>
                 <Button variant="ghost" className="text-blue-600 font-bold text-xs uppercase tracking-widest" onClick={() => handleExportData(category.category, category.holdings)}>
                   <Download className="h-4 w-4 mr-2" />Export Data
                 </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <ScrollArea className="max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none sticky top-0 z-10">
                      <TableHead className="text-[10px] uppercase tracking-widest font-black pl-8 bg-muted/30">Instrument Name</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-right bg-muted/30">Purchase Price</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-right bg-muted/30">Valuation</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-right bg-muted/30">P&L Movement</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest font-black text-center pr-8 bg-muted/30">Total Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.holdings.map((h, i) => {
                      const cv = syncedValues[h.name] || h.currentValue
                      const pl = cv - h.invested
                      const isPositive = pl >= 0
                      const liveReturns = parseFloat(((cv - h.invested) / h.invested * 100).toFixed(1))
                      return (
                        <TableRow key={i} className="hover:bg-muted/20 border-border/10 transition-colors cursor-pointer group">
                          <TableCell className="pl-8">
                            <HoverCard openDelay={200}>
                              <HoverCardTrigger asChild>
                                <div className="flex flex-col cursor-help">
                                  <span className="font-black text-sm group-hover:text-primary transition-colors">{h.name}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Global Asset ID: {h.name.substring(0,3).toUpperCase()}{String(i * 137 + 342)}
                                  </span>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80" id={`hover-holding-${h.name.replace(/\s+/g, '-')}`}>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-bold">{h.name}</h4>
                                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{category.category}</p>
                                    </div>
                                    <Badge className={isPositive ? 'bg-emerald-500' : 'bg-red-500'}>{isPositive ? '+' : ''}{liveReturns}%</Badge>
                                  </div>
                                  <Separator />
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-[9px] font-black text-muted-foreground uppercase">Average Cost</p>
                                      <p className="text-xs font-bold">₹{h.invested.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                      <p className="text-[9px] font-black text-muted-foreground uppercase">Current Price</p>
                                      <p className="text-xs font-bold">₹{cv.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                      <span>Historical Volatility</span>
                                      <span>Low</span>
                                    </div>
                                    <Progress value={25} className="h-1" />
                                  </div>
                                  <Button className="w-full text-xs h-8 font-black uppercase tracking-tighter" variant="outline">
                                    View Full Ledger
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                        <TableCell className="text-right text-muted-foreground font-mono text-xs font-bold">₹{h.invested.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-black text-foreground">
                          ₹{cv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          {syncedValues[h.name] && <span className="text-[9px] ml-1 text-blue-500 font-bold">LIVE</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 font-black text-sm italic ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {isPositive ? '+' : ''}₹{Math.round(pl).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center pr-8">
                          <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-wider py-1 px-3 ${isPositive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                            {isPositive ? '+' : ''}{liveReturns}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )
      })}
      
      </TabsContent>
        <TabsContent value="watchlist" className="py-20 text-center">
          <Card className="border-dashed border-2 p-10 max-w-md mx-auto">
            <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-sm font-bold mb-1">Your Watchlist is Empty</h3>
            <p className="text-xs text-muted-foreground">Add stocks or funds to track them in real-time without investing.</p>
            <Button className="mt-4" variant="outline" size="sm">Explore Markets</Button>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="py-20 text-center">
          <Card className="border-dashed border-2 p-10 max-w-md mx-auto">
             <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
             <h3 className="text-sm font-bold mb-1">Advanced Analytics Loading</h3>
             <p className="text-xs text-muted-foreground">We are crunching historical data for your portfolio. Check back in a few minutes.</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Asset Dialog */}
      <Dialog open={newAssetOpen} onOpenChange={closeAssetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Asset</DialogTitle>
            <DialogDescription>Add a new investment position to your portfolio.</DialogDescription>
          </DialogHeader>
          {!assetSuccess ? (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Asset Category <span className="text-red-500">*</span></Label>
                  <Select value={assetForm.category} onValueChange={v => setAssetForm({...assetForm, category: v})}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                      <SelectItem value="Stocks">Stocks</SelectItem>
                      <SelectItem value="Fixed Deposits">Fixed Deposits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest">Instrument Name <span className="text-red-500">*</span></Label>
                  <Input placeholder="e.g. Mirae Asset Large Cap Fund" value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Amount Invested (₹) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="e.g. 50000" value={assetForm.invested} onChange={e => setAssetForm({...assetForm, invested: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest">Current Value (₹)</Label>
                    <Input type="number" placeholder="Leave blank if same" value={assetForm.currentValue} onChange={e => setAssetForm({...assetForm, currentValue: e.target.value})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeAssetDialog} disabled={isAddingAsset}>Cancel</Button>
                <Button onClick={handleAddAsset} disabled={isAddingAsset} className="min-w-[140px]">
                  {isAddingAsset ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : 'Add Asset'}
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
              <h3 className="text-xl font-bold">Asset Added!</h3>
              <p className="text-sm text-muted-foreground">{assetForm.name} has been added to your {assetForm.category} portfolio.</p>
              <Button onClick={closeAssetDialog} className="mt-4 font-bold">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Insight Detail Dialog */}
      <Dialog open={insightOpen} onOpenChange={setInsightOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />{activeInsight?.title}
            </DialogTitle>
            <DialogDescription>{activeInsight?.desc}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/20 rounded-xl border border-border/50">
              <p className="text-sm font-medium leading-relaxed">{activeInsight?.detail}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">⚠️ This is an AI-generated advisory for informational purposes only. Please consult a financial advisor before making investment decisions.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInsightOpen(false)} className="font-bold">Dismiss</Button>
            <Button onClick={() => { setInsightOpen(false); toast.success('Advisory noted. A relationship manager will reach out.') }} className="font-bold">Express Interest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
