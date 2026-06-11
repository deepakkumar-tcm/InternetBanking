import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Lock, Unlock, ToggleLeft, SlidersHorizontal, KeyRound, ShieldX,
  ChevronRight, ChevronLeft, Banknote, ShoppingCart, Globe, Wifi,
  Smartphone, CreditCard, Eye, EyeOff, CheckCircle2, Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Constants ─────────────────────────────────────────────────────────────────
const TX_TYPES = [
  { key: 'atm',          label: 'ATM',               icon: Banknote     },
  { key: 'pos',          label: 'POS / In-Store',     icon: ShoppingCart },
  { key: 'ecommerce',    label: 'Ecommerce / Online', icon: Globe        },
  { key: 'tokenisation', label: 'Tokenisation',       icon: Smartphone   },
  { key: 'contactless',  label: 'Contactless',        icon: Wifi         },
]

const DEFAULT_TX_SWITCHES = {
  domestic:      { atm: true,  pos: true,  ecommerce: true,  tokenisation: true,  contactless: true  },
  international: { atm: false, pos: false, ecommerce: false, tokenisation: false, contactless: false },
}

const DEFAULT_LIMITS = {
  domestic:      { atm: 25000,  pos: 100000, ecommerce: 50000,  tokenisation: 50000, contactless: 10000 },
  international: { atm: 10000,  pos: 50000,  ecommerce: 25000,  tokenisation: 25000, contactless: 5000  },
}

const MAX_LIMITS = {
  domestic:      { atm: 100000, pos: 500000, ecommerce: 200000, tokenisation: 200000, contactless: 50000 },
  international: { atm: 50000,  pos: 200000, ecommerce: 100000, tokenisation: 100000, contactless: 25000 },
}

const fmt = n => (typeof n === 'number' ? n : 0).toLocaleString('en-IN')

// ── Sub-components ────────────────────────────────────────────────────────────

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors flex-shrink-0"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  )
}

function ScreenHeader({ onBack, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <BackButton onClick={onBack} />
      <div>
        <p className="font-bold text-lg leading-none">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function MiniCardPreview({ card }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${card.color} p-4 text-white`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] text-white/60 uppercase tracking-widest">{card.type}</p>
          <p className="font-bold text-sm leading-tight">{card.name}</p>
        </div>
        <p className="text-[10px] text-white/70 font-semibold">{card.brand}</p>
      </div>
      <p className="font-mono tracking-[.15em] text-sm my-2">{card.number}</p>
      <div className="flex justify-between text-xs">
        <div><p className="text-white/60 text-[10px] uppercase">Holder</p><p className="font-semibold">{card.holder}</p></div>
        <div className="text-right"><p className="text-white/60 text-[10px] uppercase">Expires</p><p className="font-semibold">{card.expiry}</p></div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CardSettingsModal({ card, open, onClose, isFrozen, onToggleFreeze }) {
  const [screen, setScreen]           = useState('main')

  // Lock
  const [locking, setLocking]         = useState(false)

  // Transactions
  const [domSw, setDomSw]             = useState({ ...DEFAULT_TX_SWITCHES.domestic })
  const [intlSw, setIntlSw]           = useState({ ...DEFAULT_TX_SWITCHES.international })
  const [origDomSw]                   = useState({ ...DEFAULT_TX_SWITCHES.domestic })
  const [origIntlSw]                  = useState({ ...DEFAULT_TX_SWITCHES.international })

  // Limits
  const [domLimits, setDomLimits]     = useState({ ...DEFAULT_LIMITS.domestic })
  const [intlLimits, setIntlLimits]   = useState({ ...DEFAULT_LIMITS.international })
  const [savedDomLimits, setSavedDomLimits]   = useState({ ...DEFAULT_LIMITS.domestic })
  const [savedIntlLimits, setSavedIntlLimits] = useState({ ...DEFAULT_LIMITS.international })
  const [editLimit, setEditLimit]     = useState(null)  // { scope, key, max }
  const [editVal, setEditVal]         = useState(0)

  // PIN
  const [newPin, setNewPin]           = useState('')
  const [confirmPin, setConfirmPin]   = useState('')
  const [showPin, setShowPin]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pinSaving, setPinSaving]     = useState(false)

  // Block
  const [blockReason, setBlockReason] = useState('')
  const [blocking, setBlocking]       = useState(false)

  // ── Derived ──────────────────────────────────────────────────────────────
  const txChanged = JSON.stringify(domSw) !== JSON.stringify(origDomSw) ||
                    JSON.stringify(intlSw) !== JSON.stringify(origIntlSw)

  const limitsChanged = JSON.stringify(domLimits) !== JSON.stringify(savedDomLimits) ||
                        JSON.stringify(intlLimits) !== JSON.stringify(savedIntlLimits)

  const pinValid = newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin

  const currentEditOriginal = editLimit
    ? (editLimit.scope === 'domestic' ? savedDomLimits[editLimit.key] : savedIntlLimits[editLimit.key])
    : 0

  // ── Handlers ─────────────────────────────────────────────────────────────
  const reset = () => {
    setScreen('main')
    setLocking(false)
    setNewPin(''); setConfirmPin(''); setShowPin(false); setShowConfirm(false); setPinSaving(false)
    setBlockReason(''); setBlocking(false)
    setEditLimit(null)
  }

  const handleClose = () => {
    onClose()
    setTimeout(reset, 300)
  }

  const goTo = (s) => setScreen(s)

  const openEditLimit = (scope, key) => {
    const val = scope === 'domestic' ? domLimits[key] : intlLimits[key]
    setEditLimit({ scope, key, max: MAX_LIMITS[scope][key] })
    setEditVal(val)
  }

  const saveEditLimit = () => {
    if (editLimit.scope === 'domestic') setDomLimits(p => ({ ...p, [editLimit.key]: editVal }))
    else setIntlLimits(p => ({ ...p, [editLimit.key]: editVal }))
    toast.info('Limit updated — tap Apply Changes to save')
    setEditLimit(null)
  }

  const MENU = [
    { id: 'lock',         label: isFrozen ? 'Unlock Card' : 'Lock Card',  icon: isFrozen ? Unlock : Lock, desc: isFrozen ? 'Card is currently locked' : 'Temporarily restrict card usage', danger: !isFrozen },
    { id: 'transactions', label: 'Enable/Disable Transactions',            icon: ToggleLeft,               desc: 'Domestic & international controls' },
    { id: 'limits',       label: 'Set Transaction Limits',                 icon: SlidersHorizontal,        desc: 'Per-channel spending limits' },
    { id: 'pin',          label: 'Generate Card PIN',                      icon: KeyRound,                 desc: 'Set or change your 4-digit PIN' },
    { id: 'block',        label: 'Block Lost/Stolen Card',                 icon: ShieldX,                  desc: 'Permanently block this card', danger: true },
  ]

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">

        {/* ═══════════════════════════════ MAIN MENU ═══════════════════════════ */}
        {screen === 'main' && (
          <>
            <div className="p-6 pb-4 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Card Settings</DialogTitle>
                <DialogDescription>Manage settings for {card.name}</DialogDescription>
              </DialogHeader>
              <MiniCardPreview card={card} />
              {isFrozen && (
                <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                  <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">This card is currently locked</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="p-3 pb-4 space-y-0.5">
              {MENU.map((item, i) => (
                <div key={item.id}>
                  <button
                    onClick={() => goTo(item.id)}
                    className={`w-full flex items-center gap-4 rounded-xl px-3 py-3.5 text-left transition-colors
                      ${item.danger ? 'hover:bg-red-50 dark:hover:bg-red-950/30' : 'hover:bg-muted/60'}`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${item.danger ? 'bg-red-100 dark:bg-red-950' : 'bg-muted'}`}>
                      <item.icon className={`h-5 w-5 ${item.danger ? 'text-red-600' : 'text-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${item.danger ? 'text-red-600' : ''}`}>{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                  {i < MENU.length - 1 && <Separator className="mx-3 my-0.5 opacity-50" />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════════════════ 1. LOCK CARD ════════════════════════ */}
        {screen === 'lock' && (
          <div className="p-6 space-y-5">
            <ScreenHeader onBack={() => goTo('main')} title={isFrozen ? 'Unlock Card' : 'Lock Card'} subtitle="Manage card access" />

            <MiniCardPreview card={card} />

            {/* Status badge row */}
            <div className="flex items-center justify-between rounded-xl border px-4 py-3 bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Card Status</p>
                <p className="text-sm font-bold mt-0.5">{card.name}</p>
              </div>
              <Badge className={`${isFrozen ? 'bg-red-500 hover:bg-red-500' : 'bg-emerald-500 hover:bg-emerald-500'} text-white border-0`}>
                {isFrozen ? 'Locked' : 'Active'}
              </Badge>
            </div>

            <div className={`rounded-xl border p-4 ${isFrozen
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200'}`}>
              <p className="text-sm font-semibold mb-1">
                {isFrozen ? 'Card is locked' : 'What happens when you lock?'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isFrozen
                  ? 'All transactions are blocked. Unlock to resume normal card usage.'
                  : 'All new transactions will be declined immediately. Existing scheduled payments may still process. You can unlock anytime.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goTo('main')} className="flex-1">Not Now</Button>
              <Button
                disabled={locking}
                className={`flex-1 ${isFrozen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                onClick={() => {
                  setLocking(true)
                  setTimeout(() => {
                    onToggleFreeze(card.id)
                    setLocking(false)
                    handleClose()
                  }, 800)
                }}
              >
                {locking
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing…</>
                  : isFrozen
                    ? <><Unlock className="h-4 w-4 mr-2" />Unlock Card</>
                    : <><Lock className="h-4 w-4 mr-2" />Lock Card</>}
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════ 2. ENABLE / DISABLE TRANSACTIONS ════════════ */}
        {screen === 'transactions' && (
          <div className="p-6 space-y-5">
            <ScreenHeader onBack={() => goTo('main')} title="Enable/Disable Transactions" subtitle="Control transaction types" />

            {/* Domestic */}
            <TxToggleGroup
              label="Domestic"
              color="blue"
              switches={domSw}
              onChange={(key, val) => setDomSw(p => ({ ...p, [key]: val }))}
            />

            {/* International */}
            <TxToggleGroup
              label="International"
              color="indigo"
              switches={intlSw}
              onChange={(key, val) => setIntlSw(p => ({ ...p, [key]: val }))}
            />

            <Button
              className="w-full"
              disabled={!txChanged}
              onClick={() => {
                toast.success('Transaction settings updated')
                goTo('main')
              }}
            >
              Apply Changes
            </Button>
          </div>
        )}

        {/* ═══════════════════════════ 3. SET LIMITS (list) ════════════════════ */}
        {screen === 'limits' && !editLimit && (
          <div className="p-6 space-y-5">
            <ScreenHeader onBack={() => goTo('main')} title="Set Transaction Limits" subtitle="Tap any limit to edit" />

            <LimitGroup
              label="Domestic" color="blue"
              limits={domLimits}
              onEdit={key => openEditLimit('domestic', key)}
            />

            <LimitGroup
              label="International" color="indigo"
              limits={intlLimits}
              onEdit={key => openEditLimit('international', key)}
            />

            <Button
              className="w-full"
              disabled={!limitsChanged}
              onClick={() => {
                setSavedDomLimits({ ...domLimits })
                setSavedIntlLimits({ ...intlLimits })
                toast.success('Transaction limits saved')
                goTo('main')
              }}
            >
              Apply Changes
            </Button>
          </div>
        )}

        {/* ═══════════════════════════ 3b. EDIT SINGLE LIMIT ══════════════════ */}
        {screen === 'limits' && editLimit && (
          <div className="p-6 space-y-5">
            <ScreenHeader
              onBack={() => setEditLimit(null)}
              title="Update Limit"
              subtitle={`${editLimit.scope === 'domestic' ? 'Domestic' : 'International'} · ${TX_TYPES.find(t => t.key === editLimit.key)?.label}`}
            />

            <div className="text-center space-y-1 py-2">
              <p className="text-sm text-muted-foreground font-medium">Selected Limit</p>
              <p className="text-4xl font-black tracking-tight">₹{fmt(editVal)}</p>
              {editVal !== currentEditOriginal && (
                <p className="text-xs font-semibold text-amber-600">
                  {editVal > currentEditOriginal ? '+' : ''}₹{fmt(editVal - currentEditOriginal)} from current
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Slider
                min={0}
                max={editLimit.max}
                step={500}
                value={[editVal]}
                onValueChange={v => {
                  const val = Array.isArray(v) ? v[0] : (typeof v === 'number' ? v : editVal)
                  if (typeof val === 'number') setEditVal(val)
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Min ₹0</span>
                <span>Max ₹{fmt(editLimit.max)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border p-4 bg-muted/30 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-0.5">Current Limit</p>
                <p className="font-bold">₹{fmt(currentEditOriginal)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-0.5">New Limit</p>
                <p className={`font-bold ${editVal !== currentEditOriginal ? 'text-primary' : ''}`}>₹{fmt(editVal)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditLimit(null)} className="flex-1">Cancel</Button>
              <Button
                className="flex-1"
                disabled={editVal === currentEditOriginal}
                onClick={saveEditLimit}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════ 4. GENERATE PIN ════════════════════════ */}
        {screen === 'pin' && (
          <div className="p-6 space-y-5">
            <ScreenHeader onBack={() => goTo('main')} title="Generate Card PIN" subtitle="Set a new 4-digit PIN" />

            <div className="flex items-center gap-3 rounded-xl border p-4 bg-muted/30">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Card</p>
                <p className="text-sm font-bold truncate">{card.name}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{card.number}</p>
            </div>

            <div className="space-y-4">
              {/* New PIN */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Enter New PIN</Label>
                <div className="relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className={`pr-10 font-mono text-xl tracking-[.6em] text-center
                      ${newPin.length > 0 && newPin.length < 4 ? 'border-amber-400 focus-visible:ring-amber-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPin.length > 0 && newPin.length < 4 && (
                  <p className="text-xs text-amber-600">PIN must be exactly 4 digits</p>
                )}
              </div>

              {/* Confirm PIN */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest">Confirm New PIN</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className={`pr-10 font-mono text-xl tracking-[.6em] text-center
                      ${confirmPin.length === 4 && confirmPin !== newPin ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      ${confirmPin.length === 4 && confirmPin === newPin ? 'border-emerald-500 focus-visible:ring-emerald-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPin.length === 4 && confirmPin !== newPin && (
                  <p className="text-xs text-red-500 font-medium">PINs do not match</p>
                )}
                {confirmPin.length === 4 && confirmPin === newPin && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />PINs match
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goTo('main')} className="flex-1">Cancel</Button>
              <Button
                className="flex-1"
                disabled={!pinValid || pinSaving}
                onClick={() => {
                  setPinSaving(true)
                  setTimeout(() => {
                    setPinSaving(false)
                    toast.success('PIN updated successfully')
                    handleClose()
                  }, 1000)
                }}
              >
                {pinSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save PIN'}
              </Button>
            </div>
          </div>
        )}

        {/* ═══════════════════════ 5. BLOCK LOST / STOLEN ═════════════════════ */}
        {screen === 'block' && (
          <div className="p-6 space-y-5">
            <ScreenHeader onBack={() => goTo('main')} title="Report Card Issue" subtitle="Permanently block this card" />

            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4">
              <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">⚠ This action is irreversible</p>
              <p className="text-xs text-red-600/90 dark:text-red-400/80 leading-relaxed">
                Once blocked, this card cannot be unblocked. A replacement card will be issued to your registered address.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold">What happened to the card?</p>
              <div className="space-y-2">
                {[
                  { value: 'lost',    label: 'Lost',    desc: "I can't find my card" },
                  { value: 'stolen',  label: 'Stolen',  desc: 'My card was stolen by someone' },
                  { value: 'damaged', label: 'Damaged', desc: 'My card is physically damaged' },
                  { value: 'others',  label: 'Others',  desc: 'Any other reason' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setBlockReason(opt.value)}
                    className={`w-full flex items-center gap-3.5 rounded-xl border p-3.5 text-left transition-colors
                      ${blockReason === opt.value
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'hover:bg-muted/60 border-border'}`}
                  >
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${blockReason === opt.value ? 'border-primary' : 'border-muted-foreground/40'}`}>
                      {blockReason === opt.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goTo('main')} className="flex-1">Cancel</Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!blockReason || blocking}
                onClick={() => {
                  setBlocking(true)
                  setTimeout(() => {
                    setBlocking(false)
                    toast.success(`${card.name} has been blocked. Reason: ${blockReason}. A replacement will be issued.`)
                    handleClose()
                  }, 1000)
                }}
              >
                {blocking
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Blocking…</>
                  : 'Submit & Block Card'}
              </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}

// ── Helper sub-components ─────────────────────────────────────────────────────

function TxToggleGroup({ label, color, switches, onChange }) {
  const colors = {
    blue:  { bg: 'bg-blue-100 dark:bg-blue-950',   icon: 'text-blue-600',  ring: CreditCard },
    indigo:{ bg: 'bg-indigo-100 dark:bg-indigo-950', icon: 'text-indigo-600', ring: Globe },
  }
  const c = colors[color]
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`h-6 w-6 rounded-lg ${c.bg} flex items-center justify-center`}>
          <c.ring className={`h-3.5 w-3.5 ${c.icon}`} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div className="rounded-xl border divide-y overflow-hidden">
        {TX_TYPES.map(t => (
          <div key={t.key} className="flex items-center justify-between px-4 py-3 bg-background">
            <div className="flex items-center gap-3">
              <t.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{t.label}</span>
            </div>
            <Switch
              checked={switches[t.key]}
              onCheckedChange={v => onChange(t.key, v)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function LimitGroup({ label, color, limits, onEdit }) {
  const colors = {
    blue:  { bg: 'bg-blue-100 dark:bg-blue-950',   icon: 'text-blue-600',  Icon: CreditCard },
    indigo:{ bg: 'bg-indigo-100 dark:bg-indigo-950', icon: 'text-indigo-600', Icon: Globe },
  }
  const c = colors[color]
  const fmt = n => (typeof n === 'number' ? n : 0).toLocaleString('en-IN')
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`h-6 w-6 rounded-lg ${c.bg} flex items-center justify-center`}>
          <c.Icon className={`h-3.5 w-3.5 ${c.icon}`} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <div className="rounded-xl border divide-y overflow-hidden">
        {TX_TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => onEdit(t.key)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors bg-background"
          >
            <div className="flex items-center gap-3">
              <t.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{t.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">₹{fmt(limits[t.key])}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
