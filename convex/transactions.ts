import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { LOAN_RULES } from "../utils/constants";

// ─── HELPER: hitung due date ──────────────────────────────
function calcDueDate(borrowDate: number): number {
  const due = new Date(borrowDate);
  due.setDate(due.getDate() + LOAN_RULES.loanDurationDays);
  return due.getTime();
}

// ─── HELPER: hitung denda ─────────────────────────────────
function calcFine(dueDate: number): number {
  const now = Date.now();
  if (now <= dueDate) return 0;
  const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
  return daysLate * LOAN_RULES.finePerDay;
}
function isStorageId(value: string): boolean {
  // Storage ID tidak mengandung "http" atau "https"
  return !value.startsWith('http');
}
// ─── BORROW (Petugas mencatat setelah scan QR) ───────────
export const borrowBook = mutation({
  args: {
    userId: v.id("users"),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    // cek buku tersedia
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan.");
    if (book.availableCopies <= 0) throw new Error("Buku tidak tersedia.");

    // cek user tidak punya pinjaman buku yang sama
    const existing = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("bookId"), args.bookId),
          q.or(
            q.eq(q.field("status"), "active"),
            q.eq(q.field("status"), "due_soon"),
            q.eq(q.field("status"), "overdue")
          )
        )
      )
      .first();

    if (existing) throw new Error("Kamu sudah meminjam buku ini.");

    const borrowDate = Date.now();
    const dueDate = calcDueDate(borrowDate);

    // insert transaksi
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      bookId: args.bookId,
      borrowDate,
      dueDate,
      status: "active",
    });

    // update stok buku
    await ctx.db.patch(args.bookId, {
      availableCopies: book.availableCopies - 1,
      status: book.availableCopies - 1 === 0 ? "borrowed" : "available",
    });

    return { success: true, transactionId, dueDate };
  },
});

// ─── GET PINJAMAN AKTIF USER ─────────────────────────────
export const getActiveLoans = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "due_soon"),
          q.eq(q.field("status"), "overdue"),
          q.eq(q.field("status"), "in_box"),
          q.eq(q.field("status"), "returned"), // ← tambah ini
        )
      )
      .collect();

    return await Promise.all(
      transactions.map(async (tx) => {
        const book = await ctx.db.get(tx.bookId);

        // ← resolve storage ID ke URL sama seperti getBookById
        let coverImage = book?.coverImage ?? null;
        if (coverImage && !coverImage.startsWith('http')) {
          coverImage = await ctx.storage.getUrl(coverImage as any);
        }

        const fineAmount =
          tx.status === "overdue" ? calcFine(tx.dueDate) : (tx.fineAmount ?? 0);

        return {
          ...tx,
          book: book ? { ...book, coverImage } : null,
          fineAmount
        };
      })
    );
  },
});
export const getAllActiveTransactions = query({
  handler: async (ctx) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "due_soon"),
          q.eq(q.field("status"), "overdue"),
          q.eq(q.field("status"), "in_box")
        )
      )
      .collect();

    return await Promise.all(
      transactions.map(async (tx) => {
        const book = await ctx.db.get(tx.bookId);
        const user = await ctx.db.get(tx.userId);

        // ← logic sama persis dengan getBookById
        let coverImage = book?.coverImage ?? null;
        if (coverImage && !coverImage.startsWith('http')) {
          coverImage = await ctx.storage.getUrl(coverImage as any);
        }

        const fineAmount =
          tx.status === "overdue" ? calcFine(tx.dueDate) : (tx.fineAmount ?? 0);

        return {
          ...tx,
          book: book ? { ...book, coverImage } : null,
          user: user ? { name: user.name, nim: user.nim } : null,
          fineAmount,
        };
      })
    );
  },
});

// ─── GET RIWAYAT PINJAMAN USER ───────────────────────────
export const getLoanHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "returned"),
          q.eq(q.field("status"), "lost")
        )
      )
      .collect();

    const result = await Promise.all(
      transactions.map(async (tx) => {
        const book = await ctx.db.get(tx.bookId);
        return { ...tx, book };
      })
    );

    // urutkan dari terbaru
    return result.sort((a, b) => b.borrowDate - a.borrowDate);
  },
});
export const getInBoxTransactions = query({
  handler: async (ctx) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("status"), "in_box"))
      .collect();

    return await Promise.all(
      transactions.map(async (tx) => {
        const book = await ctx.db.get(tx.bookId);
        const user = await ctx.db.get(tx.userId);

        let coverImage = book?.coverImage ?? null;
        if (coverImage && !coverImage.startsWith('http')) {
          coverImage = await ctx.storage.getUrl(coverImage as any);
        }

        return {
          ...tx,
          book: book ? { ...book, coverImage } : null,
          user: user ? { name: user.name, nim: user.nim } : null,
        };
      })
    );
  },
});

// ─── GET DETAIL TRANSAKSI ────────────────────────────────
export const getTransactionById = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) return null;
    const book = await ctx.db.get(tx.bookId);

    // ← resolve storage ID ke URL
    let coverImage = book?.coverImage ?? null;
    if (coverImage && !coverImage.startsWith('http')) {
      coverImage = await ctx.storage.getUrl(coverImage as any);
    }

    const fineAmount =
      tx.status === "overdue" ? calcFine(tx.dueDate) : (tx.fineAmount ?? 0);

    return { 
      ...tx, 
      book: book ? { ...book, coverImage } : null,
      fineAmount 
    };
  },
});
export const borrowBooks = mutation({
  args: {
    userId: v.id("users"),
    items: v.array(v.object({
      bookId: v.id("books"),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const item of args.items) {
      const book = await ctx.db.get(item.bookId);
      if (!book) throw new Error(`Buku tidak ditemukan.`);
      if (book.availableCopies < item.quantity) {
        throw new Error(`Stok buku "${book.title}" tidak cukup.`);
      }

      const borrowDate = Date.now();
      const dueDate = calcDueDate(borrowDate);

      for (let i = 0; i < item.quantity; i++) {
        const transactionId = await ctx.db.insert("transactions", {
          userId: args.userId,
          bookId: item.bookId,
          borrowDate,
          dueDate,
          status: "active",
        });
        results.push(transactionId);
      }

      const newAvailable = book.availableCopies - item.quantity;
      await ctx.db.patch(item.bookId, {
        availableCopies: newAvailable,
        status: newAvailable === 0 ? "borrowed" : "available",
      });
    }

    return { success: true, transactionIds: results };
  },
});
export const getActiveLoansAdmin = query({
  handler: async (ctx) => {
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "due_soon"),
          q.eq(q.field("status"), "overdue"),
          q.eq(q.field("status"), "returned"), // ← tambah ini
        )
      )
      .collect();

    return await Promise.all(
      transactions.map(async (tx) => {
        const book = await ctx.db.get(tx.bookId);
        const user = await ctx.db.get(tx.userId);

        let coverImage = book?.coverImage ?? null;
        if (coverImage && !coverImage.startsWith('http')) {
          coverImage = await ctx.storage.getUrl(coverImage as any);
        }

        return {
          ...tx,
          book: book ? { ...book, coverImage } : null,
          user: user ? { name: user.name, nim: user.nim } : null,
        };
      })
    );
  },
});
// ─── RETURN VIA DROP BOX ─────────────────────────────────
export const returnViaBox = mutation({
  args: {
    transactionId: v.id("transactions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new Error("Transaksi tidak ditemukan.");
    if (tx.userId !== args.userId) throw new Error("Transaksi bukan milik kamu.");

    const allowedStatuses = ["active", "due_soon", "overdue"];
    if (!allowedStatuses.includes(tx.status)) {
      throw new Error("Status transaksi tidak valid untuk dikembalikan.");
    }

    const fineAmount = calcFine(tx.dueDate);

    await ctx.db.patch(args.transactionId, {
      status: "in_box",
      returnMethod: "box",
      fineAmount,
    });

    return { success: true, fineAmount };
  },
});

// ─── RETURN VIA COUNTER (Petugas) ────────────────────────
export const returnViaCounter = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new Error("Transaksi tidak ditemukan.");

    const fineAmount = calcFine(tx.dueDate);

    await ctx.db.patch(args.transactionId, {
      status: "returned",
      returnDate: Date.now(),
      returnMethod: "counter",
      fineAmount,
    });

    // kembalikan stok buku
    const book = await ctx.db.get(tx.bookId);
    if (book) {
      const newAvailable = Math.min(book.availableCopies + 1, book.totalCopies);
      await ctx.db.patch(tx.bookId, {
        availableCopies: newAvailable,
        status: "available",
      });
    }

    return { success: true, fineAmount };
  },
});

// ─── LAPOR HILANG ─────────────────────────────────────────
export const reportLost = mutation({
  args: {
    transactionId: v.id("transactions"),
    userId: v.id("users"),
    lastSeenDate: v.string(),
    lastSeenLocation: v.string(),
    description: v.string(),
    bookCondition: v.string(),
  },
  handler: async (ctx, args) => {
    const tx = await ctx.db.get(args.transactionId);
    if (!tx) throw new Error("Transaksi tidak ditemukan.");
    if (tx.userId !== args.userId) throw new Error("Transaksi bukan milik kamu.");

    await ctx.db.patch(args.transactionId, {
      status: "lost",
      lostReport: {
        lastSeenDate: args.lastSeenDate,
        lastSeenLocation: args.lastSeenLocation,
        description: args.description,
        bookCondition: args.bookCondition,
        reportedAt: Date.now(),
      },
    });

    return { success: true };
  },
});

// ─── UPDATE STATUS OTOMATIS (jalankan via cron/scheduler) ─
export const syncOverdueStatuses = mutation({
  handler: async (ctx) => {
    const activeLoans = await ctx.db
      .query("transactions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const now = Date.now();
    let updated = 0;

    for (const tx of activeLoans) {
      if (now > tx.dueDate) {
        await ctx.db.patch(tx._id, {
          status: "overdue",
          fineAmount: calcFine(tx.dueDate),
        });
        updated++;
      } else {
        const daysRemaining = Math.ceil(
          (tx.dueDate - now) / (1000 * 60 * 60 * 24)
        );
        if (daysRemaining <= LOAN_RULES.dueSoonThresholdDays) {
          await ctx.db.patch(tx._id, { status: "due_soon" });
          updated++;
        }
      }
    }

    return { updated };
  },
});