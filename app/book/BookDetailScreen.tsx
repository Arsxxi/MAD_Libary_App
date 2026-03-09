// app/catalog/BookDetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { COLORS, SIZES } from '../../utils/constants';

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  // --- INTEGRASI CONVEX: GET BY ID ---
  const book = useQuery(api.books.getBookById, { bookId: bookId as any });

  if (!book) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {/* --- STYLING HEADER & GAMBAR UTAMA --- */}
      <View style={styles.imageHeader}>
        <Image source={{ uri: book.coverImage }} style={styles.mainCover} resizeMode="contain" />
      </View>

      <View style={styles.contentCard}>
        {/* --- INFO JUDUL & STATUS --- */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorText}>{book.author}</Text>
            <Text style={styles.titleText}>{book.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: book.status === 'available' ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={{ color: book.status === 'available' ? 'green' : 'red', fontWeight: 'bold' }}>
              {book.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* --- DETAIL LOKASI RAK & CALL NUMBER --- */}
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

        {/* --- DESKRIPSI / SUBJECT --- */}
        <Text style={styles.sectionHeading}>Subject</Text>
        <Text style={styles.descriptionText}>{book.subject}</Text>

        {/* --- TOMBOL AKSI --- */}
        <TouchableOpacity 
          style={[styles.borrowButton, { opacity: book.availableCopies > 0 ? 1 : 0.6 }]}
          disabled={book.availableCopies === 0}
        >
          <Text style={styles.buttonText}>
            {book.availableCopies > 0 ? 'Borrow This Book' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  imageHeader: { height: 300, justifyContent: 'center', alignItems: 'center', padding: 20 },
  mainCover: { width: '80%', height: '100%', borderRadius: 12 },
  contentCard: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 24,
    minHeight: 500
  },
  /* --- TEXT STYLING --- */
  authorText: { fontSize: 14, color: COLORS.textSecondary },
  titleText: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginVertical: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  /* --- GRID STYLING --- */
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  infoBox: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 12, width: '48%' },
  infoLabel: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  descriptionText: { lineHeight: 22, color: '#555', marginBottom: 30 },
  /* --- BUTTON STYLING --- */
  borrowButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});