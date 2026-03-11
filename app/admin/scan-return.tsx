import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ScanReturn() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedTransactionId, setScannedTransactionId] =
    useState<Id<"transactions"> | null>(null);

  const returnViaCounter = useMutation(api.transactions.returnViaCounter);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(true);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === "return" && parsedData.transactionId) {
        setScannedTransactionId(parsedData.transactionId as Id<"transactions">);
      } else {
        Alert.alert("Error", "Bukan QR Code untuk pengembalian yang valid.");
        setScanned(false);
      }
    } catch (e) {
      Alert.alert("Error", "Gagal membaca QR (Format tidak valid)");
      setScanned(false);
    } finally {
      setScanning(false);
    }
  };

  const scannedTransaction = useQuery(
    api.transactions.getTransactionById,
    scannedTransactionId ? { transactionId: scannedTransactionId } : "skip",
  );

  useEffect(() => {
    if (scannedTransaction === undefined) return;
    if (scannedTransaction === null) {
      if (scannedTransactionId) {
        Alert.alert("Error", "Transaksi tidak ditemukan", [
          {
            text: "Scan Ulang",
            onPress: () => {
              setScanned(false);
              setScannedTransactionId(null);
            },
          },
        ]);
      }
      return;
    }

    // Proceed to return
    handleReturn(scannedTransaction._id);
  }, [scannedTransaction]);

  const handleReturn = async (transactionId: Id<"transactions">) => {
    try {
      const result = await returnViaCounter({ transactionId });
      let message = "Pengembalian berhasil dicatat!";
      if (result.fineAmount > 0) {
        message += `\n\nCatatan: Terdapat denda sebesar Rp. ${result.fineAmount.toLocaleString("id-ID")}`;
      }

      Alert.alert("Berhasil", message, [
        { text: "OK", onPress: () => router.replace("/admin/return") },
      ]);
    } catch (e: any) {
      Alert.alert("Gagal", e.message ?? "Terjadi kesalahan", [
        {
          text: "Kembali",
          onPress: () => {
            setScanned(false);
            setScannedTransactionId(null);
          },
        },
      ]);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Butuh akses kamera</Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── BACK BUTTON ── */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#333" />
      </TouchableOpacity>

      {/* ── SCAN AREA ── */}
      <View style={styles.scanArea}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />

        {/* Corner brackets overlay */}
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        {/* Scan line */}
        <View style={styles.scanLine} />
      </View>

      {/* ── LABEL ── */}
      <View style={styles.bottomSection}>
        <Text style={styles.scanTitle}>Scan QR Pengembalian</Text>
        <Text style={styles.scanSubtitle}>
          Arahkan kamera ke QR Code mahasiswa untuk{"\n"}memproses pengembalian
          buku.
        </Text>

        {scanned && !scanning && (
          <TouchableOpacity
            style={styles.rescanBtn}
            onPress={() => {
              setScanned(false);
              setScannedTransactionId(null);
            }}
          >
            <Text style={styles.rescanText}>Scan Ulang</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── LOADING OVERLAY ── */}
      {scanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Memproses...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const BRACKET_SIZE = 28;
const BRACKET_THICKNESS = 4;
const SCAN_BOX = 360;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  scanArea: {
    width: SCAN_BOX,
    height: SCAN_BOX,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    position: "relative",
    marginTop: 50,
  },
  camera: {
    width: "100%",
    height: "100%",
  },

  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderTopWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderColor: "#007AFF",
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderTopWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderColor: "#007AFF",
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    borderColor: "#007AFF",
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    borderColor: "#007AFF",
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: "#007AFF",
    opacity: 0.6,
    borderRadius: 2,
  },

  bottomSection: {
    flex: 1,
    alignItems: "center",
    paddingTop: 35,
    paddingHorizontal: 30,
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 10,
  },
  scanSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  rescanBtn: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  rescanText: { color: "white", fontWeight: "bold", fontSize: 16 },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#007AFF",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  permissionText: { fontSize: 16, marginBottom: 20, color: "#333" },
  permissionBtn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8 },
  permissionBtnText: { color: "white", fontWeight: "bold" },
});
