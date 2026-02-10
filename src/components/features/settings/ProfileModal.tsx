'use client';

/**
 * ProfileModal — v7.0 M11
 *
 * Glass-panel modal wrapping Clerk's <UserProfile /> component.
 * Provides full profile management (name, email, password, sessions)
 * without relying on the UserButton popover hack.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [UserProfileComp, setUserProfileComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((clerk) => setUserProfileComp(() => clerk.UserProfile))
      .catch(() => {});
  }, []);

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

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-101 flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[85vh] glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Profil Yönetimi"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
                <h2 className="text-lg font-semibold text-white">Profil Yönetimi</h2>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Clerk UserProfile */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-2">
                {UserProfileComp ? (
                  <UserProfileComp
                    appearance={{
                      variables: {
                        colorPrimary: '#7C3AED',
                        colorBackground: 'transparent',
                        colorText: '#E2E8F0',
                        colorTextSecondary: '#94A3B8',
                        borderRadius: '0.75rem',
                        colorInputBackground: '#0A0A0F',
                        colorInputText: '#E2E8F0',
                      },
                      elements: {
                        rootBox: 'w-full',
                        cardBox: 'w-full shadow-none',
                        card: '!bg-transparent !shadow-none border-0',
                        navbar: '!bg-transparent border-r border-white/8',
                        navbarButton: '!text-zinc-400 hover:!text-white hover:!bg-white/5',
                        navbarButtonIcon: '!text-zinc-500',
                        navbarButton__active: '!text-white !bg-primary/20',
                        pageScrollBox: '!bg-transparent',
                        page: '!bg-transparent',
                        profileSection__profile: '!bg-transparent',
                        profileSection__emailAddresses: '!bg-transparent',
                        profileSection__connectedAccounts: '!bg-transparent',
                        profileSection__danger: '!bg-transparent',
                        profileSectionTitle: '!text-white',
                        profileSectionTitleText: '!text-white',
                        profileSectionContent: '!bg-transparent',
                        profileSectionPrimaryButton: '!text-primary hover:!text-primary',
                        formFieldLabel: '!text-zinc-400',
                        formFieldInput: '!bg-[#0A0A0F] !border-white/10 !text-white',
                        formButtonPrimary: '!bg-primary hover:!bg-primary/80 !text-white !shadow-none',
                        formButtonReset: '!text-zinc-400 hover:!text-white',
                        avatarBox: 'ring-2 ring-primary/30',
                        badge: '!bg-primary/20 !text-primary',
                        headerTitle: '!text-white',
                        headerSubtitle: '!text-zinc-400',
                        accordionTriggerButton: '!text-zinc-300',
                        accordionContent: '!bg-transparent',
                        menuButton: '!text-zinc-400 hover:!text-white',
                        menuList: '!bg-[#121223] !border-white/10',
                        menuItem: '!text-zinc-200 hover:!bg-white/10',
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
