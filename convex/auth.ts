import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── HELPER: generate Digital ID ─────────────────────────
function generateDigitalId(nim: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const nimPart = nim.slice(-4);
  return `LIB-${nimPart}-${timestamp}`;
}

// ─── HELPER: simple hash (ganti dengan bcrypt di production) ──
function simpleHash(password: string): string {
  // Di production, gunakan library bcrypt atau argon2
  // Ini hanya untuk development/preview
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

// ─── REGISTER ────────────────────────────────────────────
export const register = mutation({
  args: {
    name: v.string(),
    nim: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // cek NIM sudah terdaftar
    const existingNim = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", args.nim))
      .first();

    if (existingNim) {
      throw new Error("NIM sudah terdaftar.");
    }

    // cek email sudah terdaftar
    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingEmail) {
      throw new Error("Email sudah terdaftar.");
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
      nim: args.nim,
      email: args.email,
      passwordHash: simpleHash(args.password),
      digitalId: generateDigitalId(args.nim),
      memberStatus: "active",
      createdAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    return {
      success: true,
      userId,
      digitalId: user?.digitalId,
    };
  },
});

// ─── LOGIN ───────────────────────────────────────────────
export const login = mutation({
  args: {
    nim: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_nim", (q) => q.eq("nim", args.nim))
      .first();

    if (!user) {
      throw new Error("NIM tidak ditemukan.");
    }

    const passwordHash = simpleHash(args.password);
    if (user.passwordHash !== passwordHash) {
      throw new Error("Password salah.");
    }

    if (user.memberStatus === "suspended") {
      throw new Error("Akun kamu disuspend. Hubungi petugas Circulation.");
    }

    // return user data (tanpa passwordHash)
    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        nim: user.nim,
        email: user.email,
        digitalId: user.digitalId,
        memberStatus: user.memberStatus,
        createdAt: user.createdAt,
      },
    };
  },
});

// ─── GET USER BY ID ──────────────────────────────────────
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // jangan return passwordHash
    return {
      _id: user._id,
      name: user.name,
      nim: user.nim,
      email: user.email,
      digitalId: user.digitalId,
      memberStatus: user.memberStatus,
      createdAt: user.createdAt,
    };
  },
});

// ─── GET USER BY DIGITAL ID (untuk scan QR petugas) ──────
export const getUserByDigitalId = query({
  args: { digitalId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_digitalId", (q) => q.eq("digitalId", args.digitalId))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      nim: user.nim,
      memberStatus: user.memberStatus,
    };
  },
});