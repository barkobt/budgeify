'use client';

/**
 * SignOutDialog — v7.0 M11
 *
 * Confirmation dialog for sign-out action.
 * Uses useClerk().signOut() for direct sign-out instead of
 * hacking Clerk's UserButton popover.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface SignOutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SignOutDialog: React.FC<SignOutDialogProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-101 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-full max-w-sm glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="signout-title"
              aria-describedby="signout-desc"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/15">
                    <LogOut size={20} className="text-rose-400" />
                  </div>
                  <h2 id="signout-title" className="text-lg font-semibold text-white">
                    Çıkış Yap
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <p id="signout-desc" className="text-sm text-zinc-400">
                  Hesabınızdan çıkış yapmak istediğinize emin misiniz? Tekrar giriş yapmanız gerekecektir.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 px-6 pb-6">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-10 rounded-xl bg-white/5 border border-white/8 text-sm font-medium text-zinc-300 hover:bg-white/8 transition-all disabled:opacity-50"
                >
                  İptal
                </button>
                <SignOutButton loading={loading} setLoading={setLoading} onClose={onClose} />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * SignOutButton — Uses useClerk() hook inside a proper component context
 */
function SignOutButton({
  loading,
  setLoading,
  onClose,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
  onClose: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [useClerkHook, setUseClerkHook] = useState<(() => { signOut: () => Promise<any> }) | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => setUseClerkHook(() => clerk.useClerk))
      .catch(() => {});
  }, []);

  if (!useClerkHook) {
    return (
      <button
        disabled
        className="flex-1 h-10 rounded-xl bg-rose-500/20 text-sm font-semibold text-rose-300 opacity-50"
      >
        Yükleniyor...
      </button>
    );
  }

  return <SignOutButtonInner useClerk={useClerkHook} loading={loading} setLoading={setLoading} onClose={onClose} />;
}

function SignOutButtonInner({
  useClerk,
  loading,
  setLoading,
  onClose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useClerk: () => { signOut: () => Promise<any> };
  loading: boolean;
  setLoading: (v: boolean) => void;
  onClose: () => void;
}) {
  const clerk = useClerk();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await clerk.signOut();
    } catch {
      setLoading(false);
      onClose();
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex-1 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-sm font-semibold text-rose-300 hover:bg-rose-500/30 transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin" />
          Çıkış yapılıyor...
        </span>
      ) : (
        'Çıkış Yap'
      )}
    </button>
  );
}

export default SignOutDialog;
