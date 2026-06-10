import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Home, Landmark, ArrowLeftRight, CreditCard, TrendingUp, Settings, Download, Filter, Eye, EyeOff, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronRight, User, LogOut, Bell, Shield, HelpCircle, Trash2, Star, RefreshCw, BarChart3, List, Grid } from 'lucide-react'
import { toast } from 'sonner'

export default function NavigationDemo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewMode, setViewMode] = useState('grid')
  const [textAlign, setTextAlign] = useState('left')
  const [formatting, setFormatting] = useState([])

  useEffect(() => { console.log('[ROUTE] Current path:', window.location.pathname) }, [])

  return (
    <div id="navigation-demo-page" className="space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
        <p className="text-muted-foreground mt-1.5">Breadcrumb, Menubar, Navigation Menu, Dropdown, Context Menu, Tabs, Toggle</p>
      </div>

      {/* BREADCRUMB */}
      <section id="section-breadcrumb">
        <h2 className="text-xl font-bold mb-4">Breadcrumb</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <Breadcrumb id="breadcrumb-home">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/dashboard" className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Components Demo</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator />
            <Breadcrumb id="breadcrumb-transactions">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/accounts">Accounts</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/transactions">Transactions</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>TXN001 Details</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator />
            <Breadcrumb id="breadcrumb-loans">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/dashboard"><Home className="h-3.5 w-3.5" /></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
                <BreadcrumbItem><BreadcrumbLink href="/loans">Loans</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
                <BreadcrumbItem><BreadcrumbPage>Repayment Schedule</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>
      </section>

      {/* MENUBAR */}
      <section id="section-menubar">
        <h2 className="text-xl font-bold mb-4">Menubar</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <Menubar id="banking-menubar">
              <MenubarMenu>
                <MenubarTrigger id="menu-accounts">Accounts</MenubarTrigger>
                <MenubarContent>
                  <MenubarLabel>My Accounts</MenubarLabel>
                  <MenubarItem id="menu-item-savings">Savings <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                  <MenubarItem id="menu-item-current">Current <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                  <MenubarItem id="menu-item-fd">Fixed Deposit</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem id="menu-item-open-account">Open New Account…</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger id="menu-transactions">Transactions</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem id="menu-item-history">Transaction History</MenubarItem>
                  <MenubarItem id="menu-item-pending">Pending</MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Export</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem id="menu-item-export-csv">CSV</MenubarItem>
                      <MenubarItem id="menu-item-export-pdf">PDF</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarLabel>Date Range</MenubarLabel>
                  <MenubarRadioGroup value="thisMonth">
                    <MenubarRadioItem value="thisMonth">This Month</MenubarRadioItem>
                    <MenubarRadioItem value="last3">Last 3 Months</MenubarRadioItem>
                    <MenubarRadioItem value="thisYear">This Year</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger id="menu-view">View</MenubarTrigger>
                <MenubarContent>
                  <MenubarCheckboxItem checked>Show Balance</MenubarCheckboxItem>
                  <MenubarCheckboxItem>Show IFSC Codes</MenubarCheckboxItem>
                  <MenubarCheckboxItem checked>Show Account Numbers</MenubarCheckboxItem>
                  <MenubarSeparator />
                  <MenubarItem>Reset to Default</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger id="menu-help">Help</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem id="menu-item-support">Contact Support <MenubarShortcut>⌘?</MenubarShortcut></MenubarItem>
                  <MenubarItem id="menu-item-faq">FAQs</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem id="menu-item-about">About SecureBank</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </CardContent>
        </Card>
      </section>

      {/* NAVIGATION MENU */}
      <section id="section-nav-menu">
        <h2 className="text-xl font-bold mb-4">Navigation Menu</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <NavigationMenu id="banking-nav-menu">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger id="nav-services">Banking Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink href="/dashboard" className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-blue-600 to-indigo-700 p-6 no-underline outline-none">
                          <Shield className="h-6 w-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-bold text-white">SecureBank</div>
                          <p className="text-sm text-blue-200">256-bit encrypted internet banking.</p>
                        </NavigationMenuLink>
                      </li>
                      {[
                        { title: 'Accounts', href: '/accounts', desc: 'Savings, current & FD management' },
                        { title: 'Transfers', href: '/transfer', desc: 'NEFT, RTGS, IMPS & UPI' },
                        { title: 'Investments', href: '/investments', desc: 'Mutual funds, SIP & equity' },
                      ].map(item => (
                        <li key={item.title}>
                          <NavigationMenuLink href={item.href} className="block select-none space-y-1 rounded-xl p-3 no-underline hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium">{item.title}</div>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger id="nav-loans">Loans & Cards</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
                      {['Home Loan', 'Personal Loan', 'Vehicle Loan', 'Credit Cards'].map(title => (
                        <li key={title}>
                          <NavigationMenuLink href="/loans" className="block select-none rounded-xl p-3 hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium">{title}</div>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/support" id="nav-support-link" className="inline-flex h-10 w-max items-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    Support
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </CardContent>
        </Card>
      </section>

      {/* DROPDOWN MENU */}
      <section id="section-dropdown-menu">
        <h2 className="text-xl font-bold mb-4">Dropdown Menu</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6 flex gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger id="btn-account-actions-dropdown" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent cursor-pointer">
                <Settings className="h-4 w-4" /> Account Actions
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" id="account-actions-dropdown">
                <DropdownMenuLabel>My Savings Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem id="dd-view-statement" onSelect={() => toast.info('Opening statement...')}><Eye className="mr-2 h-4 w-4" /> View Statement</DropdownMenuItem>
                  <DropdownMenuItem id="dd-download-statement"><Download className="mr-2 h-4 w-4" /> Download <DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
                  <DropdownMenuItem id="dd-transfer"><ArrowLeftRight className="mr-2 h-4 w-4" /> Transfer Funds</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger id="dd-more-actions">More Actions</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem id="dd-freeze">Freeze Account</DropdownMenuItem>
                      <DropdownMenuItem id="dd-change-limit">Change Limit</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="dd-close" variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Close Account</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger id="btn-user-profile-dropdown" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent cursor-pointer">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">RK</div>
                Rajesh Kumar
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" id="user-profile-dropdown">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="dd-profile"><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem id="dd-security"><Shield className="mr-2 h-4 w-4" /> Security</DropdownMenuItem>
                <DropdownMenuItem id="dd-notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="dd-logout" variant="destructive"><LogOut className="mr-2 h-4 w-4" /> Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger id="btn-filter-dropdown" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent cursor-pointer">
                <Filter className="h-4 w-4" /> Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent id="filter-dropdown">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="dd-filter-credits">Credits Only</DropdownMenuItem>
                <DropdownMenuItem id="dd-filter-debits">Debits Only</DropdownMenuItem>
                <DropdownMenuItem id="dd-filter-pending">Pending Only</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="dd-clear-filters"><RefreshCw className="mr-2 h-4 w-4" /> Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </section>

      {/* CONTEXT MENU */}
      <section id="section-context-menu">
        <h2 className="text-xl font-bold mb-4">Context Menu</h2>
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">Right-click on the transaction rows below.</p>
            <div className="space-y-2" id="ctx-menu-table">
              {[
                { id: 'TXN001', desc: 'Salary Credit', amount: '₹85,000', type: 'credit' },
                { id: 'TXN002', desc: 'Amazon Purchase', amount: '₹2,299', type: 'debit' },
                { id: 'TXN003', desc: 'Home Loan EMI', amount: '₹22,000', type: 'debit' },
              ].map(txn => (
                <ContextMenu key={txn.id}>
                  <ContextMenuTrigger id={`ctx-trigger-${txn.id}`}>
                    <div className="flex items-center justify-between p-3.5 rounded-xl border hover:bg-muted/40 cursor-context-menu transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">{txn.id}</Badge>
                        <span className="text-sm font-medium">{txn.desc}</span>
                      </div>
                      <span className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                      </span>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-52" id={`ctx-menu-${txn.id}`}>
                    <ContextMenuLabel>{txn.id}</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem id={`ctx-view-${txn.id}`} onSelect={() => toast.info(`Viewing ${txn.id}`)}><Eye className="mr-2 h-4 w-4" /> View Details</ContextMenuItem>
                    <ContextMenuItem id={`ctx-download-${txn.id}`}><Download className="mr-2 h-4 w-4" /> Download Receipt</ContextMenuItem>
                    <ContextMenuItem id={`ctx-repeat-${txn.id}`}><RefreshCw className="mr-2 h-4 w-4" /> Repeat Transaction</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>Report Issue</ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <ContextMenuItem>Wrong Amount</ContextMenuItem>
                        <ContextMenuItem>Unauthorized Txn</ContextMenuItem>
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuLabel className="text-xs">Mark as</ContextMenuLabel>
                    <ContextMenuRadioGroup value="normal">
                      <ContextMenuRadioItem value="normal">Normal</ContextMenuRadioItem>
                      <ContextMenuRadioItem value="starred">Starred</ContextMenuRadioItem>
                      <ContextMenuRadioItem value="flagged">Flagged</ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TABS */}
      <section id="section-tabs">
        <h2 className="text-xl font-bold mb-4">Tabs</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} id="banking-tabs">
          <TabsList className="grid w-full grid-cols-4" id="tabs-list">
            <TabsTrigger value="overview" id="tab-overview"><Landmark className="h-4 w-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="transactions" id="tab-transactions"><ArrowLeftRight className="h-4 w-4 mr-2" />Transactions</TabsTrigger>
            <TabsTrigger value="cards" id="tab-cards"><CreditCard className="h-4 w-4 mr-2" />Cards</TabsTrigger>
            <TabsTrigger value="investments" id="tab-investments"><TrendingUp className="h-4 w-4 mr-2" />Investments</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" id="tab-content-overview">
            <Card className="border shadow-sm"><CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4" id="overview-stats">
                {[['Total Balance', '₹4,52,340'], ['Monthly Income', '₹85,000'], ['Monthly Expenses', '₹28,450']].map(([label, value], i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-muted/40">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="transactions" id="tab-content-transactions">
            <Card className="border shadow-sm"><CardContent className="pt-6 space-y-2" id="tab-txn-list">
              {[['Salary Credit', '+₹85,000', 'text-emerald-600'], ['Amazon Purchase', '-₹2,299', 'text-red-600'], ['Home Loan EMI', '-₹22,000', 'text-red-600']].map(([desc, amt, cls], i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl border text-sm"><span>{desc}</span><span className={`font-semibold ${cls}`}>{amt}</span></div>
              ))}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="cards" id="tab-content-cards">
            <Card className="border shadow-sm"><CardContent className="pt-6 space-y-2" id="tab-cards-list">
              {[['Visa Platinum', '4521', '₹1,00,000'], ['MasterCard Gold', '3812', '₹50,000']].map(([name, last, limit], i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl border text-sm"><span>{name} ••{last}</span><span className="text-muted-foreground">Limit: {limit}</span></div>
              ))}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="investments" id="tab-content-investments">
            <Card className="border shadow-sm"><CardContent className="pt-6 space-y-2" id="tab-invest-list">
              {[['HDFC Equity Fund', '₹1,20,000', '+12.4%'], ['SBI Blue Chip', '₹80,000', '+8.1%'], ['Axis Index Fund', '₹60,000', '+9.6%']].map(([name, val, ret], i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl border text-sm">
                  <span>{name}</span>
                  <div className="text-right"><p className="font-semibold">{val}</p><p className="text-xs text-emerald-600">{ret}</p></div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* TOGGLE & TOGGLE GROUP */}
      <section id="section-toggles">
        <h2 className="text-xl font-bold mb-4">Toggle & Toggle Group</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader><CardTitle className="text-base">Individual Toggles</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3" id="individual-toggles">
              <Toggle id="toggle-favorites" aria-label="Toggle favorites" variant="outline"><Star className="h-4 w-4 mr-2" /> Favourites</Toggle>
              <Toggle id="toggle-balance" aria-label="Toggle balance" variant="outline" defaultPressed><Eye className="h-4 w-4 mr-2" /> Show Balance</Toggle>
              <Toggle id="toggle-analytics" aria-label="Toggle analytics" variant="outline"><BarChart3 className="h-4 w-4 mr-2" /> Analytics</Toggle>
              <Toggle id="toggle-hide-amounts" aria-label="Toggle hide amounts" variant="outline"><EyeOff className="h-4 w-4 mr-2" /> Hide Amounts</Toggle>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardHeader><CardTitle className="text-base">Toggle Groups</CardTitle></CardHeader>
            <CardContent className="space-y-4" id="toggle-groups">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">View Mode</p>
                <ToggleGroup type="single" value={viewMode} onValueChange={v => v && setViewMode(v)} id="toggle-view-mode">
                  <ToggleGroupItem value="list" id="toggle-view-list"><List className="h-4 w-4 mr-1.5" /> List</ToggleGroupItem>
                  <ToggleGroupItem value="grid" id="toggle-view-grid"><Grid className="h-4 w-4 mr-1.5" /> Grid</ToggleGroupItem>
                  <ToggleGroupItem value="chart" id="toggle-view-chart"><BarChart3 className="h-4 w-4 mr-1.5" /> Chart</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Formatting</p>
                <ToggleGroup type="multiple" value={formatting} onValueChange={setFormatting} id="toggle-text-format">
                  <ToggleGroupItem value="bold" id="toggle-bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="italic" id="toggle-italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="underline" id="toggle-underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alignment</p>
                <ToggleGroup type="single" value={textAlign} onValueChange={v => v && setTextAlign(v)} id="toggle-text-align">
                  <ToggleGroupItem value="left" id="toggle-align-left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="center" id="toggle-align-center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="right" id="toggle-align-right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
