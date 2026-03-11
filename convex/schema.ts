import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── USERS ────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    nim: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    digitalId: v.string(),
    role: v.optional(v.string()), // "student" | "staff"         // ID unik untuk QR Code
    memberStatus: v.string(),      // "active" | "suspended"
    createdAt: v.number(),
  })
    .index("by_nim", ["nim"])
    .index("by_email", ["email"])
    .index("by_digitalId", ["digitalId"]),

  // ─── BOOKS ────────────────────────────────────────────
  books: defineTable({
    title: v.string(),
    author: v.string(),
    subject: v.string(),
    callNumber: v.string(),
    rackLocation: v.string(),
    isbn: v.optional(v.string()),
    coverImage: v.optional(v.union(v.string(), v.id("_storage"))),
    status: v.string(),            // "available" | "borrowed"
    totalCopies: v.number(),
    availableCopies: v.number(),
  })
    .index("by_title", ["title"])
    .index("by_author", ["author"])
    .index("by_subject", ["subject"])
    .index("by_status", ["status"]),

  // ─── TRANSACTIONS ─────────────────────────────────────
  transactions: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    borrowDate: v.number(),
    dueDate: v.number(),
    returnDate: v.optional(v.number()),
    status: v.string(),            // "active"|"due_soon"|"overdue"|"in_box"|"returned"|"lost"
    fineAmount: v.optional(v.number()),
    returnMethod: v.optional(v.string()), // "counter" | "box"
    // lapor hilang
    lostReport: v.optional(v.object({
      lastSeenDate: v.string(),
      lastSeenLocation: v.string(),
      description: v.string(),
      bookCondition: v.string(),   // "good" | "minor_damage" | "major_damage"
      reportedAt: v.number(),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),

  // ─── BOOKMARKS ────────────────────────────────────────
  bookmarks: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    savedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_book", ["userId", "bookId"]),

  // ─── NOTIFICATIONS ────────────────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    transactionId: v.id("transactions"),
    type: v.string(),              // "reminder_3days"|"reminder_1day"|"due_today"|"overdue"
    message: v.string(),
    sentAt: v.number(),
    isRead: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"]),
});