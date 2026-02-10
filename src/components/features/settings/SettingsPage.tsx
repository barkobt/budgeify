'use client';

/**
 * SettingsPage — v6.0 Overhaul M7
 *
 * Desktop settings full-page (lg+):
 * - Profile section: Avatar (Clerk UserProfile), name/email display
 * - Preferences: Currency selection, notification toggle, theme toggle
 * - Security: Clerk managed sessions, sign out all devices
 * - glass-panel card sections, consistent header pattern
 */

import { useState, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Moon,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Smartphone,
  Lock,
  Palette,
  CreditCard,
} from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { SignOutDialog } from './SignOutDialog';
import { ProfileModal } from './ProfileModal';
import type { CurrencyCode } from '@/types';

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'TRY', label: 'Türk Lirası', symbol: '₺' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
];

export function SettingsPage() {
  const currency = useBudgetStore((s) => s.currency);
  const setCurrency = useBudgetStore((s) => s.setCurrency);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [useUserHook, setUseUserHook] = useState<(() => { user?: any; isLoaded?: boolean }) | null>(null);

  const toggleId = useId();

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => {
        setUseUserHook(() => clerk.useUser);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Palette size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">KİŞİSELLEŞTİRME</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Ayarlar
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Hesap, tercihler ve güvenlik ayarlarınızı yönetin.</p>
        </div>
      </div>

      {/* Profile Section */}
      <SectionCard title="Profil" icon={User} description="Hesap bilgileriniz ve profil ayarlarınız">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowProfile(true)}
            className="shrink-0 group"
            aria-label="Profil yönetimini aç"
          >
            <ClerkAvatar useUser={useUserHook} />
          </button>
          <div className="min-w-0">
            <ClerkUserInfo useUser={useUserHook} />
            <button
              onClick={() => setShowProfile(true)}
              className="text-xs text-primary hover:text-primary/80 mt-1 transition-colors"
            >
              Profili Düzenle →
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Preferences Section */}
      <SectionCard title="Tercihler" icon={Globe} description="Uygulama davranışını kişiselleştirin">
        {/* Currency Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Para Birimi</label>
            <div className="grid grid-cols-3 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    currency === c.code
                      ? 'bg-primary/15 border-primary/40 text-white neon-shadow-purple'
                      : 'bg-white/3 border-white/8 text-zinc-400 hover:bg-white/5 hover:border-white/15'
                  }`}
                >
                  <span className="text-lg font-bold">{c.symbol}</span>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold">{c.code}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{c.label}</p>
                  </div>
                  {currency === c.code && (
                    <CheckCircle2 size={16} className="text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Toggle */}
          <ToggleRow
            id={`${toggleId}-notifications`}
            icon={Bell}
            label="Bildirimler"
            description="Harcama uyarıları ve hedef bildirimleri"
            checked={notifications}
            onChange={setNotifications}
          />

          {/* Dark Mode Toggle */}
          <ToggleRow
            id={`${toggleId}-darkmode`}
            icon={Moon}
            label="Karanlık Mod"
            description="Koyu tema her zaman aktif"
            checked={darkMode}
            onChange={setDarkMode}
            disabled
          />
        </div>
      </SectionCard>

      {/* Security Section */}
      <SectionCard title="Güvenlik" icon={Shield} description="Hesap güvenliği ve oturum yönetimi">
        <div className="space-y-2">
          <SecurityRow
            icon={Lock}
            label="Şifre Değiştir"
            description="Clerk profil yönetimi üzerinden"
            onClick={() => setShowProfile(true)}
          />
          <SecurityRow
            icon={Smartphone}
            label="Aktif Oturumlar"
            description="Tüm cihazlardaki oturumlarınızı yönetin"
            onClick={() => setShowProfile(true)}
          />
          <SecurityRow
            icon={CreditCard}
            label="Ödeme Yöntemleri"
            description="Henüz ödeme yöntemi eklenmedi"
            disabled
          />
          <SecurityRow
            icon={LogOut}
            label="Tüm Cihazlardan Çıkış"
            description="Tüm aktif oturumları sonlandır"
            danger
            onClick={() => setShowSignOut(true)}
          />
        </div>
      </SectionCard>

      {/* App Info */}
      <div className="glass-panel rounded-xl p-4 text-center">
        <p className="text-xs text-zinc-500">
          Budgeify v7.0 — App Store Ready
        </p>
        <p className="text-[10px] text-zinc-600 mt-1">
          Next.js • Clerk Auth • Neon DB • Framer Motion
        </p>
      </div>

      {/* Modals */}
      <SignOutDialog open={showSignOut} onClose={() => setShowSignOut(false)} />
      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}

/**
 * SectionCard — Consistent glass-panel section wrapper
 */
function SectionCard({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon: React.ElementType;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="glass-panel rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold font-display text-white">{title}</h2>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/**
 * ToggleRow — Toggle switch row for preferences
 */
function ToggleRow({
  id,
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-xl bg-white/3 border border-white/5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-zinc-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
          checked ? 'bg-primary' : 'bg-white/10'
        }`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

/**
 * SecurityRow — Security action row
 */
function SecurityRow({
  icon: Icon,
  label,
  description,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-200 text-left ${
        disabled
          ? 'bg-white/2 border-white/5 opacity-50 cursor-not-allowed'
          : danger
            ? 'bg-rose-500/5 border-rose-500/15 hover:bg-rose-500/10 hover:border-rose-500/25'
            : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={`shrink-0 ${danger ? 'text-rose-400' : 'text-zinc-400'}`} />
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-rose-300' : 'text-white'}`}>{label}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      {!disabled && (
        <ChevronRight size={16} className={`shrink-0 ${danger ? 'text-rose-500/50' : 'text-zinc-600'}`} />
      )}
    </button>
  );
}

/**
 * ClerkAvatar — Display user avatar from Clerk or fallback
 */
function ClerkAvatar({
  useUser,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUser: (() => { user?: any; isLoaded?: boolean }) | null;
}) {
  if (!useUser) {
    return <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse shrink-0" />;
  }
  return <ClerkAvatarInner useUser={useUser} />;
}

function ClerkAvatarInner({
  useUser,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUser: () => { user?: any; isLoaded?: boolean };
}) {
  let imageUrl: string | undefined;
  let initials = '?';
  try {
    const result = useUser();
    imageUrl = result.user?.imageUrl;
    const first = result.user?.firstName?.[0] || '';
    const last = result.user?.lastName?.[0] || '';
    if (first || last) initials = `${first}${last}`.toUpperCase();
  } catch {
    // Clerk not ready
  }

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt="Profil"
        className="w-14 h-14 rounded-full ring-2 ring-primary/30 object-cover group-hover:ring-primary/60 transition-all"
      />
    );
  }

  return (
    <div className="w-14 h-14 rounded-full bg-primary/20 ring-2 ring-primary/30 flex items-center justify-center group-hover:ring-primary/60 transition-all">
      <span className="text-lg font-bold text-primary">{initials}</span>
    </div>
  );
}

/**
 * ClerkUserInfo — Display user name/email from Clerk
 */
function ClerkUserInfo({
  useUser,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUser: (() => { user?: any; isLoaded?: boolean }) | null;
}) {
  if (!useUser) {
    return (
      <>
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-48 bg-white/5 rounded animate-pulse mt-1.5" />
      </>
    );
  }

  return <ClerkUserInfoInner useUser={useUser} />;
}

function ClerkUserInfoInner({
  useUser,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUser: () => { user?: any; isLoaded?: boolean };
}) {
  let user: { firstName?: string; lastName?: string; primaryEmailAddress?: { emailAddress?: string } } | undefined;
  try {
    const result = useUser();
    user = result.user;
  } catch {
    user = undefined;
  }

  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Kullanıcı'
    : 'Kullanıcı';
  const email = user?.primaryEmailAddress?.emailAddress || '';

  return (
    <>
      <p className="text-sm font-semibold text-white">{name}</p>
      {email && <p className="text-xs text-zinc-400 truncate">{email}</p>}
    </>
  );
}

export default SettingsPage;
