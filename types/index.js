import { Id } from "../convex/_generated/dataModel";

// ─── USER ───────────────────────────────────────────────
// export type MemberStatus = "active" | "suspended";

// export interface User {
//   _id: Id<"users">;
//   name: string;
//   nim: string;
//   email: string;
//   digitalId: string;
//   memberStatus: MemberStatus;
//   createdAt: number;
// }

// // ─── BOOK ────────────────────────────────────────────────
// export type BookStatus = "available" | "borrowed";

// export interface Book {
//   _id: Id<"books">;
//   title: string;
//   author: string;
//   subject: string;
//   callNumber: string;
//   rackLocation: string;
//   isbn?: string;
//   coverImage?: string;
//   status: BookStatus;
//   totalCopies: number;
//   availableCopies: number;
// }

// // ─── TRANSACTION ─────────────────────────────────────────
// export type TransactionStatus =
//   | "active"
//   | "due_soon"
//   | "overdue"
//   | "in_box"
//   | "returned"
//   | "lost";

// export interface Transaction {
//   _id: Id<"transactions">;
//   userId: Id<"users">;
//   bookId: Id<"books">;
//   borrowDate: number;
//   dueDate: number;
//   returnDate?: number;
//   status: TransactionStatus;
//   fineAmount?: number;
//   returnMethod?: "counter" | "box";
//   // joined fields
//   book?: Book;
// }

// // ─── BOOKMARK ────────────────────────────────────────────
// export interface Bookmark {
//   _id: Id<"bookmarks">;
//   userId: Id<"users">;
//   bookId: Id<"books">;
//   savedAt: number;
//   book?: Book;
// }

// // ─── NOTIFICATION ────────────────────────────────────────
// export type NotificationType =
//   | "reminder_3days"
//   | "reminder_1day"
//   | "due_today"
//   | "overdue";

// export interface Notification {
//   _id: Id<"notifications">;
//   userId: Id<"users">;
//   transactionId: Id<"transactions">;
//   type: NotificationType;
//   message: string;
//   sentAt: number;
//   isRead: boolean;
// }

// // ─── REPORT LOST FORM ────────────────────────────────────
// export interface ReportLostForm {
//   transactionId: Id<"transactions">;
//   lastSeenDate: string;
//   lastSeenLocation: string;
//   description: string;
//   bookCondition: "good" | "minor_damage" | "major_damage";
// }

// // ─── NAVIGATION PARAMS ───────────────────────────────────
// export type RootStackParamList = {
//   Home: undefined;
//   Catalog: undefined;
//   BookDetail: { bookId: Id<"books"> };
//   MyLoans: undefined;
//   LoanDetail: { transactionId: Id<"transactions"> };
//   ReportLost: { transactionId: Id<"transactions"> };
//   MyQR: undefined;
//   Bookmarks: undefined;
//   Profile: undefined;
// };