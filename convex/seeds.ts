import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {

    // ─── SEED BOOKS ──────────────────────────────────────
    const book1 = await ctx.db.insert("books", {
      title: "Seporsi Mie Ayam Sebelum Mati",
      author: "Brian Khrisna",
      subject: "Fiksi",
      callNumber: "PL5089.B75 S47 2023",
      rackLocation: "Rak A2, Lantai 1",
      isbn: "9786230503234",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1659081323i/61850662.jpg",
      status: "available",
      totalCopies: 3,
      availableCopies: 3,
    });

    const book2 = await ctx.db.insert("books", {
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      subject: "Fiksi",
      callNumber: "PL5089.H57 L37 2005",
      rackLocation: "Rak A2, Lantai 1",
      isbn: "9789792201277",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388960634i/1362193.jpg",
      status: "available",
      totalCopies: 2,
      availableCopies: 2,
    });

    const book3 = await ctx.db.insert("books", {
      title: "Bumi",
      author: "Tere Liye",
      subject: "Fiksi",
      callNumber: "PL5089.T47 B86 2014",
      rackLocation: "Rak A3, Lantai 1",
      isbn: "9786020323206",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1432561899i/25489761.jpg",
      status: "available",
      totalCopies: 2,
      availableCopies: 2,
    });

    const book4 = await ctx.db.insert("books", {
      title: "Atomic Habits",
      author: "James Clear",
      subject: "Pengembangan Diri",
      callNumber: "BF637.H37 C54 2018",
      rackLocation: "Rak B1, Lantai 2",
      isbn: "9780735211292",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
      status: "available",
      totalCopies: 4,
      availableCopies: 4,
    });

    const book5 = await ctx.db.insert("books", {
      title: "Pemrograman Web dengan React",
      author: "Sandhika Galih",
      subject: "Teknologi",
      callNumber: "QA76.73.R43 S26 2022",
      rackLocation: "Rak C1, Lantai 2",
      status: "available",
      totalCopies: 3,
      availableCopies: 3,
    });

    const book6 = await ctx.db.insert("books", {
      title: "Clean Code",
      author: "Robert C. Martin",
      subject: "Teknologi",
      callNumber: "QA76.76.C65 M37 2008",
      rackLocation: "Rak C1, Lantai 2",
      isbn: "9780132350884",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg",
      status: "available",
      totalCopies: 2,
      availableCopies: 2,
    });

    const book7 = await ctx.db.insert("books", {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      subject: "Sejarah",
      callNumber: "GN281.H37 2011",
      rackLocation: "Rak D2, Lantai 2",
      isbn: "9780062316097",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg",
      status: "borrowed",
      totalCopies: 2,
      availableCopies: 0,
    });

    const book8 = await ctx.db.insert("books", {
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      subject: "Filsafat",
      callNumber: "B528.M36 2018",
      rackLocation: "Rak D1, Lantai 2",
      isbn: "9786020633183",
      coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1556153451i/44439522.jpg",
      status: "available",
      totalCopies: 3,
      availableCopies: 3,
    });

    // ─── SEED USERS ───────────────────────────────────────
    const user1 = await ctx.db.insert("users", {
      name: "John Doe",
      nim: "12345678",
      email: "john@student.ac.id",
      passwordHash: "hash_test123",
      digitalId: "LIB-5678-ABC123",
      memberStatus: "active",
      createdAt: Date.now(),
    });

    const user2 = await ctx.db.insert("users", {
      name: "Jane Smith",
      nim: "87654321",
      email: "jane@student.ac.id",
      passwordHash: "hash_test456",
      digitalId: "LIB-4321-DEF456",
      memberStatus: "active",
      createdAt: Date.now(),
    });

    // ─── SEED TRANSACTIONS ────────────────────────────────
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // transaksi aktif normal (sisa 7 hari)
    const tx1 = await ctx.db.insert("transactions", {
      userId: user1,
      bookId: book1,
      borrowDate: now - (7 * oneDayMs),
      dueDate: now + (7 * oneDayMs),
      status: "active",
    });

    // transaksi due soon (sisa 2 hari)
    const tx2 = await ctx.db.insert("transactions", {
      userId: user1,
      bookId: book2,
      borrowDate: now - (12 * oneDayMs),
      dueDate: now + (2 * oneDayMs),
      status: "due_soon",
    });

    // transaksi overdue (terlambat 3 hari)
    const tx3 = await ctx.db.insert("transactions", {
      userId: user1,
      bookId: book3,
      borrowDate: now - (17 * oneDayMs),
      dueDate: now - (3 * oneDayMs),
      status: "overdue",
      fineAmount: 3000,
    });

    // transaksi in box
    const tx4 = await ctx.db.insert("transactions", {
      userId: user2,
      bookId: book4,
      borrowDate: now - (10 * oneDayMs),
      dueDate: now + (4 * oneDayMs),
      status: "in_box",
      returnMethod: "box",
    });

    // transaksi returned (riwayat)
    await ctx.db.insert("transactions", {
      userId: user1,
      bookId: book5,
      borrowDate: now - (30 * oneDayMs),
      dueDate: now - (16 * oneDayMs),
      returnDate: now - (17 * oneDayMs),
      status: "returned",
      returnMethod: "counter",
    });

    // transaksi lost (riwayat)
    await ctx.db.insert("transactions", {
      userId: user2,
      bookId: book6,
      borrowDate: now - (40 * oneDayMs),
      dueDate: now - (26 * oneDayMs),
      status: "lost",
      lostReport: {
        lastSeenDate: "2026-02-01",
        lastSeenLocation: "Kantin Kampus",
        description: "Buku tertinggal di kantin",
        bookCondition: "good",
        reportedAt: now - (20 * oneDayMs),
      },
    });

    // ─── SEED BOOKMARKS ───────────────────────────────────
    await ctx.db.insert("bookmarks", {
      userId: user1,
      bookId: book4,
      savedAt: Date.now(),
    });

    await ctx.db.insert("bookmarks", {
      userId: user1,
      bookId: book7,
      savedAt: Date.now(),
    });

    await ctx.db.insert("bookmarks", {
      userId: user2,
      bookId: book1,
      savedAt: Date.now(),
    });

    // ─── SEED NOTIFICATIONS ───────────────────────────────
    await ctx.db.insert("notifications", {
      userId: user1,
      transactionId: tx2,
      type: "reminder_3days",
      message: "Buku 'Laskar Pelangi' jatuh tempo dalam 2 hari. Segera kembalikan!",
      sentAt: Date.now(),
      isRead: false,
    });

    await ctx.db.insert("notifications", {
      userId: user1,
      transactionId: tx3,
      type: "overdue",
      message: "Buku 'Bumi' terlambat 3 hari. Denda: Rp 3.000.",
      sentAt: Date.now(),
      isRead: false,
    });

    await ctx.db.insert("notifications", {
      userId: user1,
      transactionId: tx1,
      type: "reminder_3days",
      message: "Buku 'Seporsi Mie Ayam' jatuh tempo dalam 7 hari.",
      sentAt: Date.now() - (2 * oneDayMs),
      isRead: true,
    });

    return {
      success: true,
      message: "Seed berhasil! Semua tabel sudah terisi.",
      data: {
        books: 8,
        users: 2,
        transactions: 6,
        bookmarks: 3,
        notifications: 3,
      },
    };
  },
});