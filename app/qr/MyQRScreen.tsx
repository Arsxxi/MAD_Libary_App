import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../utils/constants';

export default function ShowQR() {
  const { mode, bookId, transactionId } = useLocalSearchParams();
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  // Payload QR yang akan dibaca petugas
  const qrData = JSON.stringify({
    type: mode, // "borrow" | "return"
    userId: user?._id,
    bookId: bookId || null,
    transactionId: transactionId || null,
    timestamp: Date.now(),
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'borrow' ? 'Borrowing QR' : 'Return QR'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.studentLabel}>STUDENT DIGITAL ID</Text>
        
        <View style={styles.qrContainer}>
          <QRCode 
            value={qrData} 
            size={220} 
            color={COLORS.primary} 
          />
        </View>

        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userNim}>{user?.nim}</Text>

        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>
            {mode === 'borrow' ? 'Show to Librarian to Borrow' : 'Show to Librarian to Return'}
          </Text>
        </View>
      </View>

      <Text style={styles.footerNote}>
        QR Code ini bersifat dinamis dan hanya berlaku untuk transaksi saat ini.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  backText: { color: 'white', fontSize: 16 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10 },
  studentLabel: { fontSize: 12, letterSpacing: 2, color: '#888', marginBottom: 20, fontWeight: 'bold' },
  qrContainer: { padding: 15, backgroundColor: '#F9F9F9', borderRadius: 20, marginBottom: 25 },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain },
  userNim: { fontSize: 16, color: COLORS.textSecondary, marginTop: 5 },
  infoBadge: { marginTop: 30, backgroundColor: '#E0F0FF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  infoBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
  footerNote: { color: 'white', textAlign: 'center', marginTop: 40, opacity: 0.8, lineHeight: 22 }
});