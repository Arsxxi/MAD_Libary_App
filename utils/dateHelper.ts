import { LOAN_RULES } from "./constants";

// ─── FORMAT TANGGAL ──────────────────────────────────────

/**
 * Format timestamp ke string tanggal Indonesia
 * Contoh: 1704067200000 → "1 Januari 2025"
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format timestamp ke string tanggal pendek
 * Contoh: 1704067200000 → "01/01/2025"
 */
export function formatDateShort(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format timestamp ke string tanggal dan waktu
 * Contoh: "1 Januari 2025, 14:30"
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── HITUNG HARI ─────────────────────────────────────────

/**
 * Hitung sisa hari dari sekarang ke tanggal jatuh tempo
 * Nilai positif = masih ada waktu
 * Nilai negatif = sudah terlambat
 */
export function getDaysRemaining(dueDate: number): number {
  const now = new Date();
  const due = new Date(dueDate);

  // reset jam ke 00:00 supaya hitungan hari akurat
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Hitung berapa hari sudah terlambat
 * Return 0 jika belum terlambat
 */
export function getDaysLate(dueDate: number): number {
  const days = getDaysRemaining(dueDate);
  return days < 0 ? Math.abs(days) : 0;
}

/**
 * Label sisa hari untuk ditampilkan di UI
 * Contoh: "Sisa 3 hari", "Jatuh tempo hari ini", "Terlambat 2 hari"
 */
export function getDaysRemainingLabel(dueDate: number): string {
  const days = getDaysRemaining(dueDate);

  if (days > 1) return `Sisa ${days} hari`;
  if (days === 1) return "Besok jatuh tempo";
  if (days === 0) return "Jatuh tempo hari ini";
  return `Terlambat ${Math.abs(days)} hari`;
}

// ─── HITUNG DENDA ─────────────────────────────────────────

/**
 * Hitung total denda berdasarkan hari keterlambatan
 * Denda = hari terlambat × FINE_PER_DAY
 */
export function calculateFine(dueDate: number): number {
  const daysLate = getDaysLate(dueDate);
  return daysLate * LOAN_RULES.finePerDay;
}

/**
 * Format angka ke format Rupiah
 * Contoh: 5000 → "Rp 5.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── HITUNG TANGGAL ──────────────────────────────────────

/**
 * Hitung tanggal jatuh tempo dari tanggal pinjam
 * Default: 14 hari dari tanggal pinjam
 */
export function calculateDueDate(borrowDate: number): number {
  const due = new Date(borrowDate);
  due.setDate(due.getDate() + LOAN_RULES.loanDurationDays);
  return due.getTime();
}

/**
 * Cek apakah sudah masuk zona due_soon (≤ 3 hari)
 */
export function isDueSoon(dueDate: number): boolean {
  const days = getDaysRemaining(dueDate);
  return days >= 0 && days <= LOAN_RULES.dueSoonThresholdDays;
}

/**
 * Cek apakah sudah overdue
 */
export function isOverdue(dueDate: number): boolean {
  return getDaysRemaining(dueDate) < 0;
}

/**
 * Tentukan status transaksi berdasarkan dueDate
 * (untuk kalkulasi lokal, status resmi tetap dari Convex)
 */
export function resolveTransactionStatus(
  currentStatus: string,
  dueDate: number
): string {
  if (["returned", "lost", "in_box"].includes(currentStatus)) {
    return currentStatus;
  }
  if (isOverdue(dueDate)) return "overdue";
  if (isDueSoon(dueDate)) return "due_soon";
  return "active";
}