import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function ScanBorrow() {
  const { items } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedDigitalId, setScannedDigitalId] = useState<string | null>(null);

  const borrowBooks = useMutation(api.transactions.borrowBooks);

  const selectedItems: { bookId: Id<'books'>; quantity: number }[] =
    items ? JSON.parse(items as string) : [];

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScanning(true);
    try {
      setScannedDigitalId(data);
    } catch (e) {
      Alert.alert('Error', 'Gagal membaca QR');
      setScanned(false);
    } finally {
      setScanning(false);
    }
  };

  const scannedUser = useQuery(
    api.auth.getUserByDigitalId,
    scannedDigitalId ? { digitalId: scannedDigitalId } : 'skip'
  );

  useEffect(() => {
    if (scannedUser === undefined) return;
    if (scannedUser === null) {
      Alert.alert('Error', 'Mahasiswa tidak ditemukan', [
        { text: 'Scan Ulang', onPress: () => { setScanned(false); setScannedDigitalId(null); } }
      ]);
      return;
    }
    handleBorrow(scannedUser._id);
  }, [scannedUser]);

  const handleBorrow = async (userId: Id<'users'>) => {
    try {
      await borrowBooks({ userId, items: selectedItems });
      Alert.alert(
        'Berhasil',
        `Peminjaman untuk ${scannedUser?.name} berhasil dicatat!`,
        [{ text: 'OK', onPress: () => router.replace('/admin') }]
      );
    } catch (e: any) {
      Alert.alert('Gagal', e.message ?? 'Terjadi kesalahan', [
        { text: 'Kembali', onPress: () => router.back() }
      ]);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Butuh akses kamera</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
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
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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
        <Text style={styles.scanTitle}>Scan QR</Text>
        <Text style={styles.scanSubtitle}>
          Arahkan kamera ke QR Code mahasiswa untuk{'\n'}memproses peminjaman buku.
        </Text>

        <View style={styles.infoChip}>
          <Ionicons name="book-outline" size={16} color="#007AFF" />
          <Text style={styles.infoChipText}>
            {selectedItems.reduce((a, b) => a + b.quantity, 0)} buku akan dipinjamkan
          </Text>
        </View>

        {scanned && !scanning && (
          <TouchableOpacity
            style={styles.rescanBtn}
            onPress={() => { setScanned(false); setScannedDigitalId(null); }}
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
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  // ── scan area
  scanArea: {
    width: SCAN_BOX,
    height: SCAN_BOX,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    position: 'relative',
    marginTop : 50
  },
  camera: {
    width: '100%',
    height: '100%',
  },

  // corner brackets
  cornerTL: {
    position: 'absolute', top: 0, left: 0,
    width: BRACKET_SIZE, height: BRACKET_SIZE,
    borderTopWidth: BRACKET_THICKNESS, borderLeftWidth: BRACKET_THICKNESS,
    borderColor: '#007AFF', borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute', top: 0, right: 0,
    width: BRACKET_SIZE, height: BRACKET_SIZE,
    borderTopWidth: BRACKET_THICKNESS, borderRightWidth: BRACKET_THICKNESS,
    borderColor: '#007AFF', borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute', bottom: 0, left: 0,
    width: BRACKET_SIZE, height: BRACKET_SIZE,
    borderBottomWidth: BRACKET_THICKNESS, borderLeftWidth: BRACKET_THICKNESS,
    borderColor: '#007AFF', borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute', bottom: 0, right: 0,
    width: BRACKET_SIZE, height: BRACKET_SIZE,
    borderBottomWidth: BRACKET_THICKNESS, borderRightWidth: BRACKET_THICKNESS,
    borderColor: '#007AFF', borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#007AFF',
    opacity: 0.6,
    borderRadius: 2,
  },

  // ── bottom section
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 35,
    paddingHorizontal: 30,
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 10,
  },
  scanSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  infoChipText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  rescanBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  rescanText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // ── loading
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#007AFF', marginTop: 12, fontSize: 16, fontWeight: '600' },

  // ── permission
  permissionContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
  },
  permissionText: { fontSize: 16, marginBottom: 20, color: '#333' },
  permissionBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
  permissionBtnText: { color: 'white', fontWeight: 'bold' },
});