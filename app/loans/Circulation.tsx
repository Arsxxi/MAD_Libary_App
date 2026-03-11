import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAppStore } from "../../store/useAppStore";

export default function Circulation() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();

  const transaction = useQuery(
    api.transactions.getTransactionById,
    transactionId
      ? { transactionId: transactionId as Id<"transactions"> }
      : "skip",
  );

  const book = transaction?.book;

  if (!transaction || !book) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDarkMode ? "#111827" : "white" },
        ]}
      >
        <Text style={{ color: isDarkMode ? "#F9FAFB" : "black" }}>
          Loading...
        </Text>
      </View>
    );
  }

  const bgColor = isDarkMode ? "#111827" : "white";
  const textColor = isDarkMode ? "#F9FAFB" : "#333";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Image
          source={{ uri: book.coverImage || undefined }}
          style={styles.mainCover}
          resizeMode="contain"
        />

        <Text style={[styles.instructionText, { color: textColor }]}>
          Pastikan kamu sudah membawa buku fisiknya ke meja Circulation sebelum
          lanjut
        </Text>

        <TouchableOpacity
          style={styles.btnShowQR}
          onPress={() =>
            router.push({
              pathname: "/qr/MyQRScreen",
              params: { mode: "return", transactionId: transaction._id },
            })
          }
        >
          <Text style={styles.btnText}>Yes, show qr code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCancel}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  mainCover: {
    width: 250,
    height: 380,
    marginBottom: 35,
    borderRadius: 8,
  },

  instructionText: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
    lineHeight: 28,
    maxWidth: 320,
  },

  btnShowQR: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },

  btnCancel: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
