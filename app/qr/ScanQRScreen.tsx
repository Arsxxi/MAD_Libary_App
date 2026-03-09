import React, { useState } from 'react';
import { CameraView } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
      <View style={styles.overlay}>
        <Text style={styles.scanText}>Scan QR di Kotak Dropbox</Text>
        <View style={styles.focusFrame} />
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={{color: 'white'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  scanText: { color: 'white', fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  focusFrame: { width: 250, height: 250, borderColor: 'white', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2 },
  cancelBtn: { marginTop: 40, padding: 15 }
});