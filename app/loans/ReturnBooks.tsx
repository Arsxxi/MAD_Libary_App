import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../../store/useAppStore";

export default function ReturnOptions() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();

  // Ambil detail transaksi & buku dari Convex
  const loan = useQuery(api.transactions.getTransactionById, {
    transactionId: transactionId as any,
  });

  if (!loan) return null;

  const bgColor = isDarkMode ? "#111827" : "white";
  const textColor = isDarkMode ? "#F9FAFB" : "black";
  const borderColor = isDarkMode ? "#374151" : "#E0E0E0";
  const cardColor = isDarkMode ? "#1F2937" : "white";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: bgColor, borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: loan.book?.coverImage || undefined }}
            style={styles.cover}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[styles.author, { color: isDarkMode ? "#9CA3AF" : "grey" }]}
          >
            {loan.book?.author || "Unknown Author"}
          </Text>
          <Text style={[styles.title, { color: textColor }]}>
            {loan.book?.title || "Unknown Title"}
          </Text>

          <View style={styles.badgeWrapper}>
            <View
              style={[
                styles.badge,
                { backgroundColor: cardColor, borderColor },
              ]}
            >
              <Text style={[styles.badgeText, { color: textColor }]}>
                Dipinjam
              </Text>
            </View>

            {loan.status === "overdue" && (
              <View style={styles.overdueContainer}>
                <Text style={[styles.overdueLabel, { color: textColor }]}>
                  Overdue
                </Text>
                <View style={styles.overdueBadge}>
                  <Text style={styles.overdueBadgeText}>
                    RP. {loan.fineAmount || "21.000"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.choiceContainer}>
          <Text style={[styles.choiceLabel, { color: textColor }]}>
            Return via
          </Text>

          <View
            style={[
              styles.buttonRow,
              loan.status === "overdue" && { justifyContent: "center" },
            ]}
          >
            {loan.status !== "overdue" && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() =>
                  router.push({
                    pathname: "/qr/ScanQRScreen",
                    params: { transactionId: loan._id },
                  })
                }
              >
                <Text style={styles.optionBtnText}>Drop box</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.optionBtn,
                loan.status === "overdue" && { width: 140 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/loans/Circulation",
                  params: { transactionId: loan._id },
                })
              }
            >
              <Text style={styles.optionBtnText}>Circulation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "white",
  },
  backButton: { padding: 5 },
  container: { flex: 1, paddingHorizontal: 25 },

  imageWrapper: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  cover: {
    width: 200,
    height: 280,
  },

  textContainer: { marginBottom: 30 },
  author: { fontSize: 18, color: "grey", marginBottom: 5 },
  title: {
    fontSize: 28,
    fontWeight: "500",
    lineHeight: 32,
    color: "black",
    marginBottom: 15,
  },

  badgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: "white",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  badgeText: { fontSize: 13, fontWeight: "bold", color: "black" },

  overdueContainer: { alignItems: "center" },
  overdueLabel: { fontSize: 13, color: "black", marginBottom: 5 },
  overdueBadge: {
    backgroundColor: "#FF0000",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  overdueBadgeText: { color: "white", fontWeight: "bold", fontSize: 12 },

  choiceContainer: { alignItems: "center", width: "100%", marginTop: 20 },
  choiceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  optionBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  optionBtnText: { color: "white", fontWeight: "bold", fontSize: 14 },
});
