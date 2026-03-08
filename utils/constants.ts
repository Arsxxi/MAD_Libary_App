// ─── COLORS ──────────────────────────────────────────────
export const COLORS = {
  primary: "#2563EB",       // biru utama
  primaryLight: "#EFF6FF",
  secondary: "#64748B",

  success: "#16A34A",       // hijau → status active
  successLight: "#F0FDF4",

  warning: "#D97706",       // kuning → status due_soon
  warningLight: "#FFFBEB",

  danger: "#DC2626",        // merah → status overdue
  dangerLight: "#FEF2F2",

  info: "#2563EB",          // biru → status in_box
  infoLight: "#EFF6FF",

  muted: "#6B7280",         // abu → status returned
  mutedLight: "#F9FAFB",

  dark: "#111827",          // hitam → status lost
  darkLight: "#F3F4F6",

  white: "#FFFFFF",
  background: "#F8FAFC",
  border: "#E2E8F0",
  text: "#1E293B",
  textSecondary: "#64748B",
};

// ─── STATUS CONFIG ───────────────────────────────────────
export const STATUS_CONFIG = {
  active: {
    label: "Dipinjam",
    color: COLORS.success,
    bgColor: COLORS.successLight,
    description: "Buku sedang dipinjam, masih dalam batas waktu.",
  },
  due_soon: {
    label: "Segera Kembalikan",
    color: COLORS.warning,
    bgColor: COLORS.warningLight,
    description: "Jatuh tempo kurang dari 3 hari.",
  },
  overdue: {
    label: "Terlambat",
    color: COLORS.danger,
    bgColor: COLORS.dangerLight,
    description: "Sudah melewati tanggal jatuh tempo. Denda berjalan.",
  },
  in_box: {
    label: "Di Drop Box",
    color: COLORS.info,
    bgColor: COLORS.infoLight,
    description: "Buku sudah di Drop Box, menunggu verifikasi petugas.",
  },
  returned: {
    label: "Dikembalikan",
    color: COLORS.muted,
    bgColor: COLORS.mutedLight,
    description: "Buku sudah dikembalikan dan diverifikasi.",
  },
  lost: {
    label: "Hilang",
    color: COLORS.dark,
    bgColor: COLORS.darkLight,
    description: "Buku dilaporkan hilang. Harap ke meja Circulation.",
  },
};

// ─── BOOK STATUS CONFIG ──────────────────────────────────
export const BOOK_STATUS_CONFIG = {
  available: {
    label: "Tersedia",
    color: COLORS.success,
    bgColor: COLORS.successLight,
  },
  borrowed: {
    label: "Dipinjam",
    color: COLORS.danger,
    bgColor: COLORS.dangerLight,
  },
};

// ─── LOAN RULES ──────────────────────────────────────────
export const LOAN_RULES = {
  loanDurationDays: 14,         // durasi pinjam default 2 minggu
  dueSoonThresholdDays: 3,      // mulai warning H-3
  finePerDay: 1000,             // denda Rp 1.000 per hari
  maxRenewals: 2,               // maksimal perpanjang 2x
};

// ─── LIBRARY INFO ────────────────────────────────────────
export const LIBRARY_INFO = {
  name: "Perpustakaan Kampus",
  circulationHours: "Senin–Jumat, 08.00–16.00",
  circulationLocation: "Lantai 1, Gedung Perpustakaan",
  dropBoxLocation: "Pintu masuk Gedung Perpustakaan",
};

// ─── SPACING ─────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── FONT SIZE ───────────────────────────────────────────
export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// ─── BORDER RADIUS ───────────────────────────────────────
export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};