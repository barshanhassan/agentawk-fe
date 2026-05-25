import React, { useState } from 'react';
import { getUserInfo } from "@/lib/auth";
import { ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES as countries } from "@/lib/countries";
import { COUNTRY_PLACEHOLDERS } from "@/lib/countryPlaceholders";
import { phoneError, onlyDigits } from "@/lib/phone";

// Example phone placeholder for a country code. Uses the exact match when
// available, else falls back to another country with the same dial code (same
// number format — e.g. Aland Islands +358 borrows Finland's), then a generic hint.
function phonePlaceholder(code: string): string {
  if (COUNTRY_PLACEHOLDERS[code]) return COUNTRY_PLACEHOLDERS[code];
  const dial = countries.find(c => c.code === code)?.dial;
  if (dial) {
    const sameDial = countries.find(c => c.dial === dial && COUNTRY_PLACEHOLDERS[c.code]);
    if (sameDial) return COUNTRY_PLACEHOLDERS[sameDial.code];
  }
  return "Phone number";
}

const CountrySelector = ({ value, onChange, isDark }: { value: string; onChange: (val: any) => void; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = countries.find(c => c.code === value) || countries.find(c => c.code === 'US') || countries[0];

  // Manual, reliable filtering over the full country list — matches by country
  // name, dial code or ISO code (cmdk's built-in fuzzy filter was unreliable).
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    const qd = q.replace('+', '');
    return countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dial.replace('+', '').includes(qd) ||
      c.code.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(''); }}>
      <PopoverTrigger asChild>
        <button type="button" className={cn(
          // Fixed width so the chip never grows past the input's left padding and
          // hides the placeholder's first digits (long dial codes like +1264).
          'absolute left-0 top-0 bottom-0 z-10 flex items-center justify-start px-3 gap-1.5 border-r transition-colors rounded-l w-[84px] overflow-hidden',
          isDark ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
        )}>
          <img src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`} alt={selected.code} className="w-4 h-auto" />
          <span className={cn('text-[11px] font-bold', isDark ? 'text-slate-300' : 'text-slate-700')}>{selected.dial}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[280px] p-0 shadow-xl border', isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200')} align="start" sideOffset={4}>
        {/* Search box — bordered, replyagent style */}
        <div className="p-2">
          <input
            autoFocus
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              'w-full h-8 px-3 rounded-md border text-[12px] outline-none transition-colors',
              isDark
                ? 'bg-[#0b1120] border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-300'
            )}
          />
        </div>
        {/* Country list grouped by first letter (replyagent parity) */}
        <div className="max-h-60 overflow-y-auto pb-2">
          {filtered.length === 0 ? (
            <div className="text-[12px] px-3 py-3 text-slate-400">No countries found.</div>
          ) : filtered.map((country, idx) => {
            const letter = country.name.charAt(0).toUpperCase();
            const showHeader = idx === 0 || filtered[idx - 1].name.charAt(0).toUpperCase() !== letter;
            return (
              <React.Fragment key={country.code}>
                {showHeader && (
                  <div className={cn('px-3 pt-2 pb-1 text-[12px] font-bold', isDark ? 'text-slate-200' : 'text-slate-900')}>
                    {letter}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { onChange(country); setOpen(false); setQuery(''); }}
                  className={cn('flex w-full items-center gap-2.5 px-3 py-1.5 cursor-pointer text-[12px] text-left',
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700')}
                >
                  <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} alt={country.code} className="w-4 h-auto shrink-0" />
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className={cn('shrink-0', isDark ? 'text-slate-400' : 'text-slate-500')}>({country.dial})</span>
                  {selected.code === country.code && <Check className="w-3 h-3 text-primary shrink-0" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface AddAgentFormProps {
  onCancel: () => void;
  initialData?: any;
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ onCancel, initialData }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const dark = mode === 'dark';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userInfo = getUserInfo();
  const agencyId = userInfo.modelable_id;

  const { data: rolesResponse, isLoading: loadingRoles } = useQuery({
    queryKey: [`/api/agencies/${agencyId}/roles`],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/agencies/${agencyId}/roles`);
      return res.json();
    },
    enabled: !!agencyId,
  });
  const roles: any[] = (rolesResponse?.roles || []).filter((r: any) => r.status === 'ACTIVE');

  const [formData, setFormData] = useState({
    first_name: initialData?.name?.split(' ')[0] || '',
    last_name: initialData?.name?.split(' ').slice(1).join(' ') || '',
    email: initialData?.email || '',
    // Pre-select directly from the assigned role's slug (returned by members()).
    // Bulletproof — no name matching. The effect below is only a fallback for
    // older data that doesn't include role_slug.
    role: initialData?.role_slug || '',
    phone: initialData?.phone || '',
    phone_country: initialData?.phone_country || 'US',
    whatsapp: initialData?.whatsapp || '',
    whatsapp_country: initialData?.whatsapp_country || 'US',
    language: 'en',
    tfa_required: false,
    premium_access: false,
  });

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumTermsAccepted, setPremiumTermsAccepted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const targetCode = '85651';

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', `/api/agencies/${agencyId}/members`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/members`] });
      toast({ title: 'User Created' });
      onCancel();
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', `/api/agencies/${agencyId}/members/${initialData.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/members`] });
      toast({ title: 'Update Successfully' });
      onCancel();
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // When roles load, match initialData.role (name) to the actual slug
  React.useEffect(() => {
    if (initialData?.role && roles.length > 0 && !formData.role) {
      const match = roles.find((r: any) =>
        r.name.toLowerCase() === initialData.role.toLowerCase() ||
        r.slug === initialData.role.toLowerCase() ||
        r.slug === initialData.role
      );
      if (match) setFormData(prev => ({ ...prev, role: match.slug }));
    }
  }, [roles]);

  const handleSubmit = () => {
    if (!formData.first_name.trim() || !formData.email.trim()) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    // Block save if a phone/whatsapp number is too short/long (replyagent parity)
    const pErr = phoneError(formData.phone, formData.phone_country);
    const wErr = phoneError(formData.whatsapp, formData.whatsapp_country);
    if (pErr || wErr) {
      toast({ title: pErr || wErr, variant: 'destructive' });
      return;
    }
    if (initialData) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate({ ...formData, password: 'EzconnDefaultPassword123!' });
    }
  };

  const initials = [formData.first_name.charAt(0), formData.last_name.charAt(0)]
    .filter(Boolean).join('').toUpperCase() || '?';

  const displayName = [formData.first_name, formData.last_name].filter(Boolean).join(' ') || 'New User';

  const card   = dark ? 'bg-[#0f1829]' : 'bg-white';
  const border = dark ? 'border-slate-800' : 'border-slate-200';
  const text   = dark ? 'text-white'    : 'text-slate-900';
  const sub    = dark ? 'text-slate-500' : 'text-slate-400';

  const inputCls = cn(
    'h-9 text-[12px] font-medium transition-colors focus-visible:ring-1 focus-visible:ring-primary/50',
    dark
      ? 'bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-600'
      : 'bg-white border-slate-200 placeholder:text-slate-400'
  );

  const labelCls = cn('block text-[10px] font-bold uppercase tracking-widest mb-1.5', dark ? 'text-slate-500' : 'text-slate-400');

  const sectionCls = cn('rounded-xl border p-5 space-y-4', card, border);

  // Live phone/whatsapp validation errors (shown under each field)
  const phoneErr = phoneError(formData.phone, formData.phone_country);
  const whatsappErr = phoneError(formData.whatsapp, formData.whatsapp_country);

  return (
    <div className={cn('min-h-screen flex flex-col', dark ? 'bg-[#0b1120]' : 'bg-slate-50/80')}>

      {/* ── Header bar ── */}
      <div className={cn('flex items-center gap-4 px-7 py-4 border-b shrink-0', card, border)}>
        <button
          onClick={onCancel}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg border transition-colors shrink-0',
            dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          )}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="min-w-0">
          <h1 className={cn('text-[14px] font-bold', text)}>
            {initialData ? 'Edit User' : 'Add User'}
          </h1>
          <p className={cn('text-[11px]', sub)}>
            {initialData ? 'Update information and access settings' : 'Invite a new member to your agency'}
          </p>
        </div>
        <div className="ml-auto flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className={cn('h-8 px-4 text-[12px] font-semibold', dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent' : '')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !formData.first_name.trim() || !formData.email.trim()}
            className="h-8 px-5 text-[12px] font-semibold bg-primary hover:opacity-90 text-primary-foreground"
          >
            {isPending
              ? <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" />Saving...</span>
              : initialData ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">

        {/* Left (col-span-8) — Form fields */}
        <div className="col-span-8 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <div className="px-8 py-6 space-y-5">

            {/* Identity */}
            <div className={sectionCls}>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest pb-1', sub)}>Identity</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <Input className={inputCls} placeholder="John" maxLength={100} value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <Input className={inputCls} placeholder="Doe" maxLength={100} value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <Input className={inputCls} type="email" placeholder="john@example.com" maxLength={250} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!!initialData} />
                {initialData && <p className={cn('text-[11px] mt-1', sub)}>Email cannot be changed after creation.</p>}
              </div>
            </div>

            {/* Contact */}
            <div className={sectionCls}>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest pb-1', sub)}>Contact</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Phone</label>
                  <div className="relative">
                    <CountrySelector isDark={dark} value={formData.phone_country} onChange={c => setFormData({ ...formData, phone_country: c.code })} />
                    <Input className={cn(inputCls, 'pl-[84px]')} inputMode="numeric" placeholder={phonePlaceholder(formData.phone_country)} value={formData.phone} onChange={e => setFormData({ ...formData, phone: onlyDigits(e.target.value) })} />
                  </div>
                  {phoneErr && <p className="text-[11px] text-red-500 mt-1">{phoneErr}</p>}
                </div>
                <div>
                  <label className={labelCls}>WhatsApp</label>
                  <div className="relative">
                    <CountrySelector isDark={dark} value={formData.whatsapp_country} onChange={c => setFormData({ ...formData, whatsapp_country: c.code })} />
                    <Input className={cn(inputCls, 'pl-[84px]')} inputMode="numeric" placeholder={phonePlaceholder(formData.whatsapp_country)} value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: onlyDigits(e.target.value) })} />
                  </div>
                  {whatsappErr && <p className="text-[11px] text-red-500 mt-1">{whatsappErr}</p>}
                </div>
              </div>
            </div>

            {/* Access */}
            <div className={sectionCls}>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest pb-1', sub)}>Access</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Role</label>
                  <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })} disabled={loadingRoles}>
                    <SelectTrigger className={cn(inputCls, 'w-full')}>
                      <SelectValue placeholder={loadingRoles ? 'Loading...' : 'Select role'} />
                    </SelectTrigger>
                    <SelectContent className={cn('shadow-xl', dark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200')}>
                      {roles.length === 0
                        ? <div className="px-3 py-4 text-center text-[12px] text-slate-400">No roles available</div>
                        : roles.map((r: any) => <SelectItem key={r.id} value={r.slug} className="text-[12px]">{r.name}</SelectItem>)
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={labelCls}>Language</label>
                  <Select value={formData.language} onValueChange={val => setFormData({ ...formData, language: val })}>
                    <SelectTrigger className={cn(inputCls, 'w-full')}><SelectValue /></SelectTrigger>
                    <SelectContent className={cn('shadow-xl', dark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200')}>
                      <SelectItem value="en" className="text-[12px]">English</SelectItem>
                      <SelectItem value="ar" className="text-[12px]">Arabic</SelectItem>
                      <SelectItem value="fr" className="text-[12px]">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className={sectionCls}>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest pb-1', sub)}>Security</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={cn('text-[12px] font-bold', text)}>Two-Factor Authentication</p>
                  <p className={cn('text-[11px] mt-0.5', sub)}>Require 2FA for this user's account</p>
                </div>
                <Switch checked={formData.tfa_required} onCheckedChange={val => setFormData({ ...formData, tfa_required: val })} className="data-[state=checked]:bg-primary shrink-0" />
              </div>
            </div>

            {/* Premium */}
            <div className={sectionCls}>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest pb-1', sub)}>Premium</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={cn('text-[12px] font-bold', text)}>Premium Support Access</p>
                  <p className={cn('text-[11px] mt-0.5', sub)}>Dedicated support channel for this user · $2.49/mo</p>
                </div>
                <Switch checked={formData.premium_access} onCheckedChange={val => { if (val) setShowPremiumModal(true); else setFormData({ ...formData, premium_access: false }); }} className="data-[state=checked]:bg-amber-500 shrink-0" />
              </div>
              {formData.premium_access && (
                <div className={cn('flex items-start gap-2.5 p-3 rounded-lg border text-[11px]', dark ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-700')}>
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  Premium support is active. You will be billed $2.49/month.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right (col-span-4) — Profile preview panel */}
        <div className={cn(
          'col-span-4 flex flex-col overflow-y-auto',
          dark ? 'bg-[#0c1525]' : 'bg-slate-50/60'
        )}>
          <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/25 flex items-center justify-center mb-4 transition-all">
              <span className="text-[34px] font-black text-primary select-none leading-none">{initials}</span>
            </div>
            <p className={cn('text-[14px] font-bold leading-tight', text)}>{displayName}</p>
            <p className={cn('text-[11px] mt-1 break-all', sub)}>{formData.email || '—'}</p>

            {/* Role chip */}
            {formData.role && (
              <span className={cn(
                'mt-3 inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border',
                dark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
              )}>
                {roles.find((r: any) => r.slug === formData.role)?.name || formData.role}
              </span>
            )}
          </div>

          {/* Summary rows */}
          <div className={cn('mx-4 rounded-xl border divide-y text-[11px]', dark ? 'border-slate-800 divide-slate-800' : 'border-slate-200 divide-slate-100')}>
            {[
              { label: 'Language', value: formData.language === 'en' ? 'English' : formData.language === 'ar' ? 'Arabic' : formData.language === 'fr' ? 'French' : formData.language },
              { label: '2FA', value: formData.tfa_required ? 'Required' : 'Optional' },
              { label: 'Premium', value: formData.premium_access ? 'Active' : 'Off' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-3 py-2.5">
                <span className={sub}>{row.label}</span>
                <span className={cn('font-semibold', text)}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          <p className={cn('text-[10px] text-center px-6 pb-6 leading-relaxed', sub)}>
            Changes are saved when you click{' '}
            <span className="font-bold">{initialData ? 'Update User' : 'Add User'}</span>
          </p>
        </div>

      </div>

      {/* Premium confirmation modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={cn(
            'w-full max-w-[380px] rounded-2xl shadow-2xl p-7',
            dark ? 'bg-[#0f1829] border border-slate-800' : 'bg-white border border-slate-200'
          )}>
            <div className="flex flex-col items-center text-center">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                dark ? 'bg-amber-500/15' : 'bg-amber-50')}>
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className={cn('text-[14px] font-bold mb-1.5', text)}>Enable Premium Support?</h2>
              <p className={cn('text-[11px] leading-relaxed mb-5', sub)}>
                This will charge $2.49/month per billing cycle. You can disable it at any time.
              </p>
              <div className="w-full space-y-4 text-left">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                    checked={premiumTermsAccepted}
                    onChange={e => setPremiumTermsAccepted(e.target.checked)}
                  />
                  <span className={cn('text-[11px]', sub)}>
                    I authorize this recurring charge and agree to the billing terms
                  </span>
                </label>
                <div>
                  <p className={cn('text-[11px] mb-1.5', sub)}>
                    Type <span className={cn('font-black', text)}>{targetCode}</span> to confirm
                  </p>
                  <Input
                    className={inputCls}
                    placeholder="Enter code..."
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setShowPremiumModal(false); setFormData({ ...formData, premium_access: false }); }}
                    className={cn(
                      'flex-1 h-8 rounded-lg text-[12px] font-semibold border transition-colors',
                      dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!premiumTermsAccepted || verificationCode !== targetCode}
                    onClick={() => { setShowPremiumModal(false); setFormData({ ...formData, premium_access: true }); }}
                    className={cn(
                      'flex-1 h-8 rounded-lg text-[12px] font-semibold transition-colors',
                      premiumTermsAccepted && verificationCode === targetCode
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : dark ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    Enable Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAgentForm;
