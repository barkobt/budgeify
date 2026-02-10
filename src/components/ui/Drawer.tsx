'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * Drawer Component - Vaul-based Bottom Sheet
 *
 * Professional bottom drawer with proper closing functionality.
 * Uses vaul library for native-like mobile experience.
 *
 * Features:
 * - Swipe to close
 * - Backdrop click to close
 * - Close button
 * - Backdrop blur
 * - Handle indicator
 * - Smooth animations
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  children,
  title,
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <VaulDrawer.Root
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground
    >
      <VaulDrawer.Portal>
        {/* Overlay - Click to close */}
        <VaulDrawer.Overlay
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          onClick={handleClose}
        />
        <VaulDrawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[96vh] flex-col rounded-t-2xl shadow-2xl border-t border-white/10"
          style={{ background: 'linear-gradient(180deg, rgba(13, 13, 31, 0.98) 0%, rgba(10, 10, 26, 0.98) 100%)' }}
        >
          {/* Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-white/20" aria-hidden="true" />

          {/* Title with Close Button */}
          {title && (
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <VaulDrawer.Title className="text-lg font-semibold text-white">
                {title}
              </VaulDrawer.Title>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 transition-all hover:bg-white/15 hover:text-white active:scale-95"
                aria-label="Kapat"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
          {/* P9: Screen reader description for drawer content */}
          <VaulDrawer.Description className="sr-only">
            {title ? `${title} formu` : 'İçerik paneli'}
          </VaulDrawer.Description>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};

export default Drawer;
