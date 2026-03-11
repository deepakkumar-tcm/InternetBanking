import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { User, Shield, Bell, Gauge, Save, Upload, Eye, EyeOff } from 'lucide-react'

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    console.log("[ROUTE] Current path:", window.location.pathname)
    console.log("[ROUTE] Navigation state:", window.history.state)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in" id="settings-page">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start gap-1" id="settings-tabs">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="limits">
            <Gauge className="h-4 w-4 mr-2" />
            Limits
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6" id="profile-form">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    RK
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="first-name">First Name</label>
                    <Input id="first-name" defaultValue="Rajesh" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="last-name">Last Name</label>
                    <Input id="last-name" defaultValue="Kumar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
                    <Input id="email" type="email" defaultValue="rajesh.kumar@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
                    <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
                    <Input id="dob" type="date" defaultValue="1990-05-15" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="pan">PAN Number</label>
                    <Input id="pan" defaultValue="ABCPK1234Z" disabled />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      className="flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200"
                      defaultValue="42, 3rd Cross, HSR Layout, Sector 7, Bangalore - 560102, Karnataka"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="city">City</label>
                    <Input id="city" defaultValue="Bangalore" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="pincode">PIN Code</label>
                    <Input id="pincode" defaultValue="560102" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button id="save-profile">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account uses a strong, unique password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md" id="security-form">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="current-password">Current Password</label>
                    <div className="relative">
                      <Input id="current-password" type={showPassword ? 'text' : 'password'} placeholder="Enter current password" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="new-password">New Password</label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="confirm-password">Confirm New Password</label>
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button id="update-password">Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" id="2fa-settings">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-gray-800">SMS OTP</p>
                      <p className="text-sm text-gray-500">Receive OTP via SMS for login</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-gray-800">Email OTP</p>
                      <p className="text-sm text-gray-500">Receive OTP via email for transactions</p>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-gray-800">Authenticator App</p>
                      <p className="text-sm text-gray-500">Use Google Authenticator or similar</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-gray-800">Biometric Login</p>
                      <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
                    </div>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3" id="login-activity">
                  {[
                    { device: 'Chrome on Windows', location: 'Bangalore, India', time: 'Active now', current: true },
                    { device: 'Mobile App on Android', location: 'Bangalore, India', time: '2 hours ago', current: false },
                    { device: 'Firefox on macOS', location: 'Mumbai, India', time: '2 days ago', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{session.device}</p>
                        <p className="text-xs text-gray-400">{session.location} • {session.time}</p>
                      </div>
                      {session.current ? (
                        <Badge variant="success">Current</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Revoke</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" id="notification-settings">
                {[
                  { label: 'Transaction Alerts', desc: 'Get notified for all debit/credit transactions', sms: true, email: true, push: true },
                  { label: 'Login Alerts', desc: 'Alerts when your account is logged in', sms: true, email: true, push: false },
                  { label: 'Bill Payment Reminders', desc: 'Reminders before bill due dates', sms: false, email: true, push: true },
                  { label: 'Promotional Offers', desc: 'Offers and campaigns from SecureBank', sms: false, email: false, push: true },
                  { label: 'Investment Updates', desc: 'Portfolio and NAV updates', sms: false, email: true, push: true },
                  { label: 'EMI Reminders', desc: 'Reminders before EMI deduction dates', sms: true, email: true, push: true },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">{pref.label}</p>
                      <p className="text-sm text-gray-500">{pref.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={pref.sms} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <span className="text-xs text-gray-500">SMS</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={pref.email} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <span className="text-xs text-gray-500">Email</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked={pref.push} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <span className="text-xs text-gray-500">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-border">
                <Button id="save-notifications">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
              <CardDescription>Configure daily and per-transaction limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6" id="limits-form">
                {[
                  { label: 'IMPS Daily Limit', current: '₹5,00,000', fieldId: 'imps-limit' },
                  { label: 'NEFT Daily Limit', current: '₹10,00,000', fieldId: 'neft-limit' },
                  { label: 'RTGS Daily Limit', current: '₹25,00,000', fieldId: 'rtgs-limit' },
                  { label: 'UPI Daily Limit', current: '₹1,00,000', fieldId: 'upi-limit' },
                  { label: 'Card Online Transaction Limit', current: '₹50,000', fieldId: 'card-online-limit' },
                  { label: 'ATM Withdrawal Limit', current: '₹50,000', fieldId: 'atm-limit' },
                ].map((limit) => (
                  <div key={limit.fieldId} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{limit.label}</p>
                      <p className="text-xs text-gray-400 mt-1">Current: {limit.current}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500" htmlFor={limit.fieldId}>New Limit</label>
                      <Input id={limit.fieldId} type="number" placeholder="Enter new limit" />
                    </div>
                    <Button variant="outline" size="sm" className="w-fit">Update</Button>
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 font-medium">⚠️ Limit changes require OTP verification and will take effect within 24 hours.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
