// app/profile/ProfileScreen.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { COLORS } from "../../utils/constants";

// Ganti import Clerk dengan useAuth lokal kamu
import { useAuth } from "../../hooks/useAuth"; // Sesuaikan path ke folder hooks/store kamu

import { useAppStore } from "../../store/useAppStore";

export default function ProfileScreen() {
  // Ambil userId dari hook useAuth lokal kamu
  const { userId } = useAuth();

  // Ambil data jumlah bookmark, dark mode dari store
  const bookmarkedBookIds = useAppStore((state) => state.bookmarkedBookIds);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  // Tambahkan 'skip' jika userId kosong agar tidak muncul error validator
  const profile = useQuery(
    api.users.getProfile,
    userId ? { userId: userId as Id<"users"> } : "skip",
  );

  const bgColor = isDarkMode ? "#111827" : "#FFFFFF";
  const textColor = isDarkMode ? "#F9FAFB" : "black";
  const cardColor = isDarkMode ? "#1F2937" : "#FFFFFF";
  const borderColor = isDarkMode ? "#374151" : "#E8E8E8";

  if (profile === undefined) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", backgroundColor: bgColor },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top Navigation Back Button */}
      <View
        style={[
          styles.topNav,
          { backgroundColor: bgColor, borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* --- HEADER PROFIL --- */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <Image
              source={{ uri: "https://avatar.iran.liara.run/public" }}
              style={styles.avatarImage}
            />
          )}
        </View>
        <Text style={[styles.userName, { color: textColor }]}>
          {profile.name}
        </Text>
      </View>

      {/* --- STATS CARD --- */}
      <View
        style={[styles.statsCard, { backgroundColor: cardColor, borderColor }]}
      >
        <View style={styles.statBox}>
          <Feather name="book" size={32} color="#007AFF" />
          <Text
            style={[styles.statLabel, { color: isDarkMode ? "#AAA" : "#666" }]}
          >
            Books
          </Text>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {profile.stats.totalBorrowed} books
          </Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="file-text" size={32} color="#007AFF" />
          <Text
            style={[styles.statLabel, { color: isDarkMode ? "#AAA" : "#666" }]}
          >
            Active
          </Text>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {profile.stats.currentlyBorrowed} books
          </Text>
        </View>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => router.push("/bookmarks/BookmarksScreen")}
        >
          <Feather name="bookmark" size={32} color="#007AFF" />
          <Text
            style={[styles.statLabel, { color: isDarkMode ? "#AAA" : "#666" }]}
          >
            Saved
          </Text>
          <Text style={[styles.statNumber, { color: textColor }]}>
            {bookmarkedBookIds.size} books
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- SETTINGS/ACTIONS CARD --- */}
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: cardColor, borderColor },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingLabelRow}>
            <Ionicons
              name="moon-outline"
              size={24}
              color={textColor}
              style={{ marginRight: 15 }}
            />
            <Text style={[styles.settingText, { color: textColor }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? COLORS.primary : "#f4f3f4"}
          />
        </View>
      </View>

      {/* --- LOGOUT BUTTON --- */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await SecureStore.deleteItemAsync("campus_library_user_id");
            router.replace("/auth/LoginScreen");
          }}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topNav: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
  },
  header: { alignItems: "center", paddingTop: 40, paddingBottom: 20 },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#D1E6F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  avatarImage: { width: 110, height: 110, borderRadius: 55 },
  userName: { color: "black", fontSize: 32, fontWeight: "bold" },

  statsCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 35,
    paddingHorizontal: 15,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  statBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 13, color: "#666", marginTop: 15, marginBottom: 5 },
  statNumber: { fontSize: 13, fontWeight: "700", color: "black" },

  settingsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
  },

  menuSection: { alignItems: "center", marginTop: 40 },
  logoutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: "60%",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
