// app/loans/MyLoansScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';

export default function MyLoansScreen() {
  // Simulasi userId, nantinya ambil dari useAuth/Zustand
  const loans = useQuery(api.transactions.getLoanHistory, { userId: "user_id_anda" as any });

  const renderLoanItem = ({ item }: any) => {
    const isOverdue = item.status === 'overdue';
    
    return (
      <View style={styles.loanCard}>
        {/* --- BAGIAN KIRI: GAMBAR --- */}
        <Image source={{ uri: item.bookCover }} style={styles.thumbnail} />

        {/* --- BAGIAN TENGAH: INFO --- */}
        <View style={styles.infoContent}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
          <Text style={styles.dateText}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
          
          {/* --- STATUS BADGE (Dinamis Overdue/Active) --- */}
          <View style={[styles.badge, { backgroundColor: isOverdue ? '#FFE5E5' : '#E5F1FF' }]}>
            <Text style={[styles.badgeText, { color: isOverdue ? 'red' : COLORS.primary }]}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* --- BAGIAN KANAN: COUNTDOWN/FINE --- */}
        <View style={styles.rightInfo}>
          {isOverdue ? (
            <Text style={styles.fineText}>Fine: Rp {item.fineAmount}</Text>
          ) : (
            <Text style={styles.daysLeft}>3 Days Left</Text>
          )}
        </View>
      </View>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 24, fontWeight: 'bold', padding: 20, color: COLORS.textMain },
  /* --- CARD STYLING --- */
  loanCard: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2
  },
  thumbnail: { width: 60, height: 80, borderRadius: 8 },
  infoContent: { flex: 1, marginLeft: 12 },
  bookTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  dateText: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  /* --- RIGHT SIDE STYLING --- */
  rightInfo: { alignItems: 'flex-end' },
  daysLeft: { color: COLORS.primary, fontWeight: '600' },
  fineText: { color: 'red', fontWeight: 'bold' }
});