import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useAppStore } from "../../store/useAppStore";
import { COLORS } from "../../utils/constants";
export default function ShowQR() {
  const { mode, bookId, transactionId } = useLocalSearchParams();
  const user = useAppStore((state) => state.user);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const router = useRouter();

  // tambah default value 'borrow' kalau mode tidak ada
  const qrMode = mode ?? "borrow";
  // Payload QR yang akan dibaca petugas
  const qrData = JSON.stringify({
    type: mode, // "borrow" | "return"
    userId: user?._id,
    bookId: bookId || null,
    transactionId: transactionId || null,
    timestamp: Date.now(),
  });
  const bgColor = isDarkMode ? "#111827" : COLORS.primary; // Dark gray or brand primary
  const cardColor = isDarkMode ? "#1F2937" : "white";
  const textColor = isDarkMode ? "#F9FAFB" : COLORS.textMain;
  const subtitleColor = isDarkMode ? "#9CA3AF" : COLORS.textSecondary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {qrMode === "borrow" ? "Borrowing QR" : "Return QR"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cardColor,
            shadowColor: isDarkMode ? "#000" : "#000",
          },
        ]}
      >
        <Text style={styles.studentLabel}>STUDENT DIGITAL ID</Text>

        <View
          style={[
            styles.qrContainer,
            { backgroundColor: isDarkMode ? "#FFFFFF" : "#F9F9F9" },
          ]}
        >
          <QRCode value={qrData} size={220} color={COLORS.primary} />
        </View>

        <Text style={[styles.userName, { color: textColor }]}>
          {user?.name}
        </Text>
        <Text style={[styles.userNim, { color: subtitleColor }]}>
          {user?.nim}
        </Text>

        <View
          style={[
            styles.infoBadge,
            {
              backgroundColor: isDarkMode
                ? "rgba(37, 99, 235, 0.2)"
                : "#E0F0FF",
            },
          ]}
        >
          <Text
            style={[
              styles.infoBadgeText,
              { color: isDarkMode ? "#60A5FA" : COLORS.primary },
            ]}
          >
            {mode === "borrow"
              ? "Show to Librarian to Borrow"
              : "Show to Librarian to Return"}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.footerNote, { color: isDarkMode ? "#9CA3AF" : "white" }]}
      >
        QR Code ini bersifat dinamis dan hanya berlaku untuk transaksi saat ini.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 40,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    elevation: 10,
  },
  studentLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#888",
    marginBottom: 20,
    fontWeight: "bold",
  },
  qrContainer: {
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    marginBottom: 25,
  },
  userName: { fontSize: 22, fontWeight: "bold", color: COLORS.textMain },
  userNim: { fontSize: 16, color: COLORS.textSecondary, marginTop: 5 },
  infoBadge: {
    marginTop: 30,
    backgroundColor: "#E0F0FF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  infoBadgeText: { color: COLORS.primary, fontWeight: "bold", fontSize: 13 },
  footerNote: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    opacity: 0.8,
    lineHeight: 22,
  },
});
