import { useMutation } from "convex/react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../../store/useAppStore";

export default function ScanDropbox() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions(); // ← tambah ini

  const markAsInBox = useMutation(api.transactions.returnViaBox);

  const onScan = async ({ data }: any) => {
    if (scanned) return;
    setScanned(true);

    try {
      await markAsInBox({
        transactionId: transactionId as any,
        userId: "user_id_kamu" as any,
      });
      alert("Berhasil! Silahkan masukkan buku ke dalam kotak.");
      router.replace("/");
    } catch (e) {
      alert("Gagal memproses: " + e);
      setScanned(false);
    }
  };

  // ← tambah permission check
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#111827" : "white" },
        ]}
      >
        <View style={styles.overlay}>
          <Text
            style={[
              styles.scanText,
              { color: isDarkMode ? "#F9FAFB" : "white" },
            ]}
          >
            Butuh akses kamera
          </Text>
          <TouchableOpacity
            style={[
              styles.cancelBtn,
              isDarkMode && { backgroundColor: "#374151", borderRadius: 8 },
            ]}
            onPress={requestPermission}
          >
            <Text style={{ color: isDarkMode ? "#93C5FD" : "white" }}>
              Izinkan Kamera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back" // ← tambah ini
        onBarcodeScanned={scanned ? undefined : onScan} // ← tambah guard
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }} // ← tambah ini
      />
      <View style={styles.overlay}>
        <Text
          style={[styles.scanText, { color: isDarkMode ? "#F9FAFB" : "white" }]}
        >
          Scan QR di Kotak Dropbox
        </Text>
        <View
          style={[styles.focusFrame, isDarkMode && { borderColor: "#60A5FA" }]}
        />
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={{ color: isDarkMode ? "#F9FAFB" : "white" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  focusFrame: {
    width: 250,
    height: 250,
    borderColor: "white",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 2,
  },
  cancelBtn: { marginTop: 40, padding: 15 },
});
