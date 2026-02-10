'use client';

import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

export const AIBoxShell: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 h-full min-w-0 flex flex-col">
      <div className="flex items-center gap-2 mb-4 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
          <Lightbulb size={16} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold font-display text-white truncate">Akıllı Öneriler</h3>
          <p className="text-[10px] text-slate-500 truncate">Oracle kapalıyken hafif görünüm</p>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] p-3 space-y-3 min-w-0">
        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
          <p className="text-[11px] text-slate-300 break-words">
            Bu hafta sabit giderlerinizi gözden geçirip tek bir kalemde %5 azaltmayı deneyin.
          </p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
          <p className="text-[11px] text-slate-300 break-words">
            Tasarruf hedefiniz için otomatik aylık transfer planı oluşturmanız önerilir.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-sm font-semibold text-slate-200 hover:bg-white/[0.06] transition-all"
      >
        <Sparkles size={14} />
        Oracle açıldığında detaylı analiz aktif olur
      </button>
    </div>
  );
};

export default AIBoxShell;
