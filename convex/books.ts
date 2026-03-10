import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── SEARCH BUKU ─────────────────────────────────────────
export const searchBooks = query({
  args: {
    keyword: v.string(),
    filterBy: v.optional(v.string()), // "title" | "author" | "subject"
  },
  handler: async (ctx, args) => {
    const allBooks = await ctx.db.query("books").collect();

    if (!args.keyword.trim()) return allBooks;

    const keyword = args.keyword.toLowerCase();
    const filterBy = args.filterBy ?? "title";

    return allBooks.filter((book) => {
      if (filterBy === "title") {
        return book.title.toLowerCase().includes(keyword);
      }
      if (filterBy === "author") {
        return book.author.toLowerCase().includes(keyword);
      }
      if (filterBy === "subject") {
        return book.subject.toLowerCase().includes(keyword);
      }
      return false;
    });
  },
});

export const getAllBooks = query({
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();

    return await Promise.all(
      books.map(async (book) => {
        let coverImage = book.coverImage ?? null;

        
        if (coverImage && !coverImage.startsWith('http')) {
          coverImage = await ctx.storage.getUrl(coverImage as any);
        }

        return { ...book, coverImage };
      })
    );
  },
});

export const getBookById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) return null;

    let coverImage = book.coverImage ?? null;

    if (coverImage && !coverImage.startsWith('http')) {
      coverImage = await ctx.storage.getUrl(coverImage as any);
    }

    return { ...book, coverImage };
  },
});
// ─── UPDATE STATUS BUKU ──────────────────────────────────
export const updateBookStatus = mutation({
  args: {
    bookId: v.id("books"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan.");

    let availableCopies = book.availableCopies;

    if (args.status === "borrowed") {
      if (availableCopies <= 0) {
        throw new Error("Tidak ada salinan yang tersedia.");
      }
      availableCopies -= 1;
    } else if (args.status === "available") {
      availableCopies = Math.min(availableCopies + 1, book.totalCopies);
    }

    await ctx.db.patch(args.bookId, {
      status: availableCopies === 0 ? "borrowed" : "available",
      availableCopies,
    });

    return { success: true };
  },
});

// ─── TAMBAH BUKU BARU (admin) ─────────────────────────────
export const addBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    subject: v.string(),
    callNumber: v.string(),
    rackLocation: v.string(),
    isbn: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    totalCopies: v.number(),
  },
  handler: async (ctx, args) => {
    const bookId = await ctx.db.insert("books", {
      ...args,
      status: "available",
      availableCopies: args.totalCopies,
    });

    return { success: true, bookId };
  },
});