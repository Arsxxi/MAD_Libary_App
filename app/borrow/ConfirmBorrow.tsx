import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore'; 
import { COLORS } from '../../utils/constants';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
export default function ConfirmBorrowScreen() {
  const { bookId, duration, dueDate } = useLocalSearchParams();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const book = useQuery(api.books.getBookById, { bookId: bookId as any });

  // ambil duration dari params, fallback 14 kalau tidak ada
  const durationNumber = duration ? Number(duration) : 14;

  // ambil dueDate dari params kalau ada, kalau tidak hitung dari duration
  const dueDateObj = dueDate
    ? new Date(Number(dueDate))
    : (() => { const d = new Date(); d.setDate(d.getDate() + durationNumber); return d; })();

  const formattedDueDate = dueDateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toLowerCase();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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
            <View style={styles.inputBox}>
              <Text>{durationNumber} days</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Due</Text>
            <View style={styles.inputBox}>
              <Text>{formattedDueDate}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
  paddingBottom: 40,
  flexGrow: 1,
  alignItems: 'center' 
  },
  container: { flex: 1, padding: 25, backgroundColor: 'white'},
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