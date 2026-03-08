import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── GET PROFIL USER ─────────────────────────────────────
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // hitung statistik pinjaman
    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalBorrowed = allTransactions.length;
    const currentlyBorrowed = allTransactions.filter((tx) =>
      ["active", "due_soon", "overdue", "in_box"].includes(tx.status)
    ).length;
    const lateCount = allTransactions.filter(
      (tx) => tx.status === "overdue"
    ).length;
    const returnedCount = allTransactions.filter(
      (tx) => tx.status === "returned"
    ).length;

    return {
      _id: user._id,
      name: user.name,
      nim: user.nim,
      email: user.email,
      digitalId: user.digitalId,
      memberStatus: user.memberStatus,
      createdAt: user.createdAt,
      stats: {
        totalBorrowed,
        currentlyBorrowed,
        lateCount,
        returnedCount,
      },
    };
  },
});

// ─── UPDATE PROFIL ────────────────────────────────────────
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // filter hanya field yang diberikan
    const patch: Record<string, string> = {};
    if (updates.name) patch.name = updates.name;
    if (updates.email) patch.email = updates.email;

    if (Object.keys(patch).length === 0) {
      throw new Error("Tidak ada data yang diupdate.");
    }

    await ctx.db.patch(userId, patch);
    return { success: true };
  },
});