'use client';

/**
 * NotificationPanel — v7.1 Glass-panel Notification Dropdown
 *
 * Renders computed notifications from useNotifications hook.
 * Types: warning (amber), info (blue), success (emerald).
 */

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Bell } from 'lucide-react';
import type { Notification } from './useNotifications';

const TYPE_CONFIG = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
  },
} as const;

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 rounded-xl bg-card-dark border border-white/10 shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-primary" />
          <span className="text-sm font-semibold text-white">Bildirimler</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-white transition-colors"
        >
          Kapat
        </button>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell size={24} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Bildirim yok</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = TYPE_CONFIG[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/3 transition-colors`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center mt-0.5`}>
                  <Icon size={14} className={config.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{notification.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notification.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
