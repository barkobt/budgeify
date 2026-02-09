'use client';

import type { MergedTransaction } from '@/components/features/transactions/TransactionTable';
import type { CurrencyCode } from '@/types';
import { formatCurrency, formatDateShort } from '@/utils';

/**
 * Export utilities for transaction data
 * Supports CSV and PDF export formats
 */

// ========================================
// CSV EXPORT
// ========================================

export function exportToCSV(transactions: MergedTransaction[], currency: CurrencyCode = 'TRY'): void {
  const headers = ['Tür', 'İşlem', 'Kategori', 'Tutar', 'Tarih', 'Durum', 'Beklenen Tarih'];

  const rows = transactions.map((tx) => [
    tx.type === 'income' ? 'Gelir' : 'Gider',
    tx.label,
    tx.categoryName,
    `${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount, currency)}`,
    formatDateShort(tx.date),
    tx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor',
    tx.expectedDate ? formatDateShort(tx.expectedDate) : '-',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `budgeify-islemler-${getDateStamp()}.csv`);
}

// ========================================
// PDF EXPORT
// ========================================

export async function exportToPDF(transactions: MergedTransaction[], currency: CurrencyCode = 'TRY'): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Budgeify - İşlem Raporu', 14, 18);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Oluşturulma: ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 25);

  // Summary
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Toplam Gelir: ${formatCurrency(totalIncome, currency)}  |  Toplam Gider: ${formatCurrency(totalExpense, currency)}  |  Net: ${formatCurrency(totalIncome - totalExpense, currency)}`, 14, 31);

  // Table
  const tableData = transactions.map((tx) => [
    tx.type === 'income' ? 'Gelir' : 'Gider',
    tx.label,
    tx.categoryName,
    `${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount, currency)}`,
    formatDateShort(tx.date),
    tx.status === 'completed' ? 'Tamamlandi' : 'Bekliyor',
    tx.expectedDate ? formatDateShort(tx.expectedDate) : '-',
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    startY: 36,
    head: [['Tur', 'Islem', 'Kategori', 'Tutar', 'Tarih', 'Durum', 'Beklenen Tarih']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    columnStyles: {
      3: { halign: 'right' },
    },
  });

  doc.save(`budgeify-islemler-${getDateStamp()}.pdf`);
}

// ========================================
// HELPERS
// ========================================

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getDateStamp(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
