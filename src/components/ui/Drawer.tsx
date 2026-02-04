'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * Drawer Component - Vaul-based Bottom Sheet
 *
 * Professional bottom drawer with swipe-to-close functionality.
 * Uses vaul library for native-like mobile experience.
 *
 * Features:
 * - Swipe to close
 * - Backdrop blur
 * - Handle indicator
 * - Smooth animations
 * - Snap points support
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  children,
  title,
}) => {
  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
        />
        <VaulDrawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl bg-white"
        >
          {/* Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-slate-300" />

          {/* Title */}
          {title && (
            <div className="border-b border-slate-100 px-6 py-4">
              <VaulDrawer.Title className="text-lg font-semibold text-slate-900">
                {title}
              </VaulDrawer.Title>
            </div>
          )}

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
