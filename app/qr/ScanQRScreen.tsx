import React, { useState } from 'react';
import { CameraView } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ScanDropbox() {
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();
  const [scanned, setScanned] = useState(false);

  // Gunakan mutasi yang sudah kamu buat di transactions.ts
  const markAsInBox = useMutation(api.transactions.returnViaBox);

  const onScan = async ({ data }: any) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Asumsi data QR di Box adalah "UB-DROPBOX-01"
      await markAsInBox({ 
        transactionId: transactionId as any,
        userId: "user_id_kamu" as any
      });
      alert("Berhasil! Silahkan masukkan buku ke dalam kotak.");
      // navigate to the home/index page
      router.replace('/');          // ← use a valid route
    } catch (e) {
      alert("Gagal memproses: " + e);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        onBarcodeScanned={onScan}
      />
      <SafeAreaView style={styles.overlayWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Scan QR di Kotak Dropbox</Text>
          <View style={styles.focusFrame} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    alignItems: 'flex-start'
  },
  backBtn: {
    padding: 10,
  },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -80 },
  scanText: { color: 'white', fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  focusFrame: { width: 250, height: 250, borderColor: 'white', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2 },
});