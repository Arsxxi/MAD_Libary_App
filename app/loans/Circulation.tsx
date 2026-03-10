import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function Circulation() {
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();

  const transaction = useQuery(
    api.transactions.getTransactionById,
    transactionId ? { transactionId: transactionId as Id<"transactions"> } : "skip"
  );

  const book = transaction?.book;

  if (!transaction || !book) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{ uri: book.coverImage }}
          style={styles.mainCover}
          resizeMode="contain"
        />
        
        <Text style={styles.instructionText}>
          Pastikan kamu sudah membawa buku fisiknya ke meja Circulation sebelum lanjut
        </Text>

        <TouchableOpacity 
          style={styles.btnShowQR}
          onPress={() => router.push({
            pathname: '/qr/MyQRScreen',
            params: { mode: 'return', transactionId: transaction._id }
          })}
        >
          <Text style={styles.btnText}>Yes, show qr code</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnCancel}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white', paddingTop: Platform.OS === 'android' ? 25 : 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  
  mainCover: {
    width: 250,
    height: 380,
    marginBottom: 35,
    borderRadius: 8,
  },
  
  instructionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 40,
    lineHeight: 28,
    maxWidth: 320,
  },
  
  btnShowQR: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center'
  },
  
  btnCancel: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center'
  },
  
  btnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
});
