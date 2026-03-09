import { useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { COLORS } from '../../utils/constants';

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const book = useQuery(
    api.books.getBookById,
    bookId ? { bookId: bookId as Id<'books'> } : 'skip'
  );

  if (!book) return (
    <View style={styles.center}>
      <Text>Loading...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* --- HEADER DENGAN TOMBOL KEMBALI --- */}
      <View style={styles.imageHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Image
          source={
            book.coverImage
              ? { uri: book.coverImage }
              : require('../../assets/images/icon.png')
          }
          style={styles.mainCover}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentCard}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorText}>{book.author}</Text>
            <Text style={styles.titleText}>{book.title}</Text>
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: book.status === 'available' ? '#E8F5E9' : '#FFEBEE'
          }]}>
            <Text style={{
              color: book.status === 'available' ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {book.status === 'available' ? 'TERSEDIA' : 'DIPINJAM'}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>CALL NUMBER</Text>
            <Text style={styles.infoValue}>{book.callNumber}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>SHELF LOCATION</Text>
            <Text style={styles.infoValue}>{book.rackLocation}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Subject</Text>
        <Text style={styles.descriptionText}>{book.subject}</Text>

        {/* --- TOMBOL BORROW --- */}
        <TouchableOpacity
          style={[styles.borrowButton, { opacity: book.availableCopies > 0 ? 1 : 0.6 }]}
          disabled={book.availableCopies === 0}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={styles.buttonText}>
            {book.availableCopies > 0 ? 'Borrow This Book' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL KONFIRMASI BORROW --- */}
      <Modal visible={showConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📚 Pinjam Buku</Text>
            <Text style={styles.modalBookTitle}>{book.title}</Text>
            <Text style={styles.modalAuthor}>{book.author}</Text>

            <View style={styles.modalInfoBox}>
              <Text style={styles.modalLabel}>Call Number</Text>
              <Text style={styles.modalValue}>{book.callNumber}</Text>
            </View>

            <View style={styles.modalInfoBox}>
              <Text style={styles.modalLabel}>Lokasi Rak</Text>
              <Text style={styles.modalValue}>{book.rackLocation}</Text>
            </View>

            <Text style={styles.modalNote}>
              Pastikan kamu sudah mengambil buku fisiknya dari rak sebelum ke meja Circulation.
            </Text>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => {
                setShowConfirm(false);
                router.push('/(tabs)/qr');
              }}
            >
              <Text style={styles.modalConfirmText}>Ya, Tampilkan QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowConfirm(false)}
            >
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  imageHeader: { height: 300, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { fontSize: 20, color: COLORS.white, fontWeight: 'bold' },
  mainCover: { width: '80%', height: '100%', borderRadius: 12 },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 500,
  },
  authorText: { fontSize: 14, color: COLORS.textSecondary },
  titleText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginVertical: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  infoBox: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 12, width: '48%' },
  infoLabel: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  descriptionText: { lineHeight: 22, color: '#555', marginBottom: 30 },
  borrowButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1E293B' },
  modalBookTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  modalAuthor: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  modalInfoBox: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 8 },
  modalLabel: { fontSize: 10, color: '#94A3B8', marginBottom: 2 },
  modalValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  modalNote: { fontSize: 13, color: '#64748B', textAlign: 'center', marginVertical: 16, lineHeight: 20 },
  modalConfirmBtn: { backgroundColor: '#2563EB', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 8 },
  modalConfirmText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  modalCancelBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
  modalCancelText: { color: '#64748B', fontSize: 15 },
});