import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';

export default function LoanDetailScreen() {
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();
  
  // Ambil detail transaksi & buku dari Convex
  const loan = useQuery(api.transactions.getTransactionById, { 
    transactionId: transactionId as any 
  });

  if (!loan) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bookInfoCard}>
        <Image source={{ uri: loan.book?.coverImage }} style={styles.cover} />
        <View style={styles.badge}><Text style={styles.badgeText}>Dipinjam</Text></View>
        <Text style={styles.title}>{loan.book?.title}</Text>
        <Text style={styles.author}>{loan.book?.author}</Text>
      </View>

      <Text style={styles.choiceLabel}>Return via</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push({ 
            pathname: '/qr/ScanQRScreen', 
            params: { transactionId: loan._id } 
          })}
        >
          <Text style={styles.buttonText}>Drop box</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push({ 
            pathname: '/qr/MyQRScreen', 
            params: { mode: 'return', transactionId: loan._id } 
          })}
        >
          <Text style={styles.buttonText}>Circulation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 25, alignItems: 'center' },
  bookInfoCard: { alignItems: 'center', marginTop: 40 },
  cover: { width: 140, height: 200  },
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  author: { color: 'grey', marginTop: 5 },
  choiceLabel: { marginTop: 50, fontSize: 16, color: '#555' },
  buttonRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' },
  optionButton: { backgroundColor: COLORS.primary, width: '47%', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});