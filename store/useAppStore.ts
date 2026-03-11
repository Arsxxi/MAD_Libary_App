import { create } from "zustand";
import { Id } from "../convex/_generated/dataModel";

// ─── TYPES ───────────────────────────────────────────────
interface AppUser {
  _id: Id<"users">;
  name: string;
  nim: string;
  email: string;
  digitalId: string;
  memberStatus: string;
}

interface AppState {
  // ── User ──────────────────────────────────────────────
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;

  // ── Bookmarks (local state untuk UI responsif) ────────
  // ID buku yang sudah di-bookmark (sinkron dengan Convex)
  bookmarkedBookIds: Set<Id<"books">>;
  addBookmark: (bookId: Id<"books">) => void;
  removeBookmark: (bookId: Id<"books">) => void;
  setBookmarks: (bookIds: Id<"books">[]) => void;
  isBookmarked: (bookId: Id<"books">) => boolean;

  // ── UI State ──────────────────────────────────────────
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // ── Search State ──────────────────────────────────────
  searchKeyword: string;
  searchFilter: "title" | "author" | "subject";
  setSearchKeyword: (keyword: string) => void;
  setSearchFilter: (filter: "title" | "author" | "subject") => void;

  // ── Reset (saat logout) ───────────────────────────────
  resetStore: () => void;
}

// ─── STORE ───────────────────────────────────────────────
export const useAppStore = create<AppState>((set, get) => ({
  // ── User ──────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),

  // ── Bookmarks ─────────────────────────────────────────
  bookmarkedBookIds: new Set(),

  addBookmark: (bookId) =>
    set((state) => ({
      bookmarkedBookIds: new Set([...state.bookmarkedBookIds, bookId]),
    })),

  removeBookmark: (bookId) =>
    set((state) => {
      const newSet = new Set(state.bookmarkedBookIds);
      newSet.delete(bookId);
      return { bookmarkedBookIds: newSet };
    }),

  setBookmarks: (bookIds) => set({ bookmarkedBookIds: new Set(bookIds) }),

  isBookmarked: (bookId) => get().bookmarkedBookIds.has(bookId),

  // ── UI State ──────────────────────────────────────────
  activeTab: "Home",
  setActiveTab: (tab) => set({ activeTab: tab }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // ── Search State ──────────────────────────────────────
  searchKeyword: "",
  searchFilter: "title",
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  // ── Reset ─────────────────────────────────────────────
  resetStore: () =>
    set({
      user: null,
      bookmarkedBookIds: new Set(),
      activeTab: "Home",
      isDarkMode: false,
      searchKeyword: "",
      searchFilter: "title",
    }),
}));
