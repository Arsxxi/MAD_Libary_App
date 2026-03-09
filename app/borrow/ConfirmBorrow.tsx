import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore'; // Gunakan store kamu
import { COLORS } from '../../utils/constants';

export default function ConfirmBorrowScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const book = useQuery(api.books.getBookById, { bookId: bookId as any });
  
  const [duration, setDuration] = useState("14 days");

  // Logika hitung tanggal (Due Date)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  return (
    <View style={styles.container}>
      <Image source={{ uri: book?.coverImage }} style={styles.mainCover} />
      <Text style={styles.author}>{book?.author}</Text>
      <Text style={styles.title}>{book?.title}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Call number</Text>
        <View style={styles.inputBox}><Text>{book?.callNumber}</Text></View>

        <Text style={styles.label}>Location</Text>
        <View style={[styles.inputBox, { backgroundColor: '#007AFF' }]}>
          <Text style={{ color: 'white' }}>{book?.rackLocation}</Text>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Borrow duration</Text>
            <View style={styles.inputBox}><Text>{duration}</Text></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Due</Text>
            <View style={styles.inputBox}>
                <Text>{dueDate.toLocaleDateString('id-ID')}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.btnProceed}
        onPress={() => router.push({ 
            pathname: '/qr/MyQRScreen', 
            params: { mode: 'borrow', bookId } 
        })}
      >
        <Text style={styles.btnText}>Proceed</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.btnCancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: 'white', alignItems: 'center' },
  mainCover: { width: 180, height: 260, borderRadius: 10, marginTop: 40 },
  author: { color: 'grey', marginTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  form: { width: '100%', marginTop: 20 },
  label: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  inputBox: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 15 },
  row: { flexDirection: 'row' },
  btnProceed: { backgroundColor: '#007AFF', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold' },
  btnCancel: { color: 'red', marginTop: 15, fontWeight: 'bold' }
});