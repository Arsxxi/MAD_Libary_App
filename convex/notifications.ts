import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── GET NOTIFIKASI USER ─────────────────────────────────
export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return notifications.sort((a, b) => b.sentAt - a.sentAt);
  },
});

// ─── GET JUMLAH NOTIF BELUM DIBACA ───────────────────────
export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    return unread.length;
  },
});

// ─── TANDAI SUDAH DIBACA ─────────────────────────────────
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { isRead: true });
    return { success: true };
  },
});

// ─── TANDAI SEMUA SUDAH DIBACA ───────────────────────────
export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unread.map((notif) => ctx.db.patch(notif._id, { isRead: true }))
    );

    return { success: true, count: unread.length };
  },
});

// ─── KIRIM REMINDER (jalankan via scheduler) ─────────────
export const sendReminders = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // ambil semua transaksi aktif
    const activeTransactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "due_soon")
        )
      )
      .collect();

    let sent = 0;

    for (const tx of activeTransactions) {
      const daysRemaining = Math.ceil((tx.dueDate - now) / oneDayMs);
      let type: string | null = null;
      let message = "";

      if (daysRemaining === 3) {
        type = "reminder_3days";
        message = "Buku kamu jatuh tempo dalam 3 hari. Segera kembalikan!";
      } else if (daysRemaining === 1) {
        type = "reminder_1day";
        message = "Besok buku kamu jatuh tempo. Jangan lupa kembalikan!";
      } else if (daysRemaining === 0) {
        type = "due_today";
        message = "Hari ini adalah batas waktu pengembalian bukumu!";
      } else if (daysRemaining < 0) {
        type = "overdue";
        const daysLate = Math.abs(daysRemaining);
        const fine = daysLate * 1000;
        message = `Bukumu terlambat ${daysLate} hari. Denda: Rp ${fine.toLocaleString("id-ID")}.`;
      }

      if (!type) continue;

      // cek apakah notif tipe ini sudah dikirim hari ini
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const alreadySent = await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", tx.userId))
        .filter((q) =>
          q.and(
            q.eq(q.field("transactionId"), tx._id),
            q.eq(q.field("type"), type!),
            q.gte(q.field("sentAt"), today.getTime())
          )
        )
        .first();

      if (alreadySent) continue;

      await ctx.db.insert("notifications", {
        userId: tx.userId,
        transactionId: tx._id,
        type,
        message,
        sentAt: now,
        isRead: false,
      });

      sent++;
    }

    return { success: true, sent };
  },
});

// ─── LOG MANUAL (untuk debugging) ────────────────────────
export const getLogs = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db.query("notifications");

    const results = await queryBuilder.collect();

    const filtered = args.userId
      ? results.filter((n) => n.userId === args.userId)
      : results;

    const sorted = filtered.sort((a, b) => b.sentAt - a.sentAt);

    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});