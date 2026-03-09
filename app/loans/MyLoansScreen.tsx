import { useQuery } from 'convex/react';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../utils/constants';

export default function MyLoansScreen() {
  const { userId } = useAuth();
  const router = useRouter();

  const loans = useQuery(
    api.transactions.getActiveLoans,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  ) ?? [];

  const renderLoanItem = ({ item }: { item: any }) => {
    const isOverdue = item.status === 'overdue';
    const isActive = ['active', 'due_soon', 'overdue'].includes(item.status);

    let daysLeftText = '';
    if (!isOverdue && item.dueDate) {
      const due = new Date(item.dueDate);
      const now = new Date();
      const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      daysLeftText = `${diff} day${diff === 1 ? '' : 's'} left`;
    }

    // ambil gambar dari join book
    const coverImage = item.book?.coverImage;

    return (
      <TouchableOpacity
        style={styles.loanCard}
        onPress={() => {
          if (isActive) {
            router.push({
              pathname: '/loans/ReturnBooks',
              params: { transactionId: item._id }
            });
          }
        }}
        activeOpacity={isActive ? 0.7 : 1}
      >
        {/* --- BAGIAN KIRI: GAMBAR --- */}
        <Image
          source={
            coverImage
              ? { uri: coverImage }
              : require('../../assets/images/icon.png')
          }
          style={styles.thumbnail}
        />

        {/* --- BAGIAN TENGAH: INFO --- */}
        <View style={styles.infoContent}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.book?.title ?? 'Judul tidak tersedia'}
          </Text>
          <Text style={styles.authorText} numberOfLines={1}>
            {item.book?.author ?? ''}
          </Text>
          <Text style={styles.dateText}>
            Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}
          </Text>

          <View style={[
            styles.badge,
            { backgroundColor: isOverdue ? '#FFE5E5' : '#E5F1FF' },
          ]}>
            <Text style={[
              styles.badgeText,
              { color: isOverdue ? 'red' : COLORS.primary },
            ]}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* --- BAGIAN KANAN: COUNTDOWN/FINE --- */}
        <View style={styles.rightInfo}>
          {isOverdue ? (
            <Text style={styles.fineText}>Fine: Rp {item.fineAmount}</Text>
          ) : (
            <Text style={styles.daysLeft}>{daysLeftText}</Text>
          )}
          {isActive && (
            <Text style={styles.tapHint}>Tap →</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Loans</Text>
      <FlatList
        data={loans}
        keyExtractor={(item) => item._id}
        renderItem={renderLoanItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada pinjaman aktif</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: COLORS.text,
  },
  loanCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  thumbnail: { width: 60, height: 80, borderRadius: 8 },
  infoContent: { flex: 1, marginLeft: 12 },
  bookTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  authorText: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  dateText: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  rightInfo: { alignItems: 'flex-end' },
  daysLeft: { color: COLORS.primary, fontWeight: '600' },
  fineText: { color: 'red', fontWeight: 'bold' },
  tapHint: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});