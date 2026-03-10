import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Modal, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore'; 
import { COLORS } from '../../utils/constants';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ConfirmBorrowScreen() {
  const { bookId, duration: paramDuration } = useLocalSearchParams();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const book = useQuery(api.books.getBookById, { bookId: bookId as any });
  
  const [duration, setDuration] = useState(paramDuration ? parseInt(paramDuration as string, 10) : 14);
  const [showPicker, setShowPicker] = useState(false);

  // Logika hitung tanggal (Due Date)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + duration);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Image source={{ uri: book?.coverImage }} style={styles.mainCover} resizeMode="contain" />
        <Text style={styles.author}>{book?.author}</Text>
        <Text style={styles.title}>{book?.title}</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Call number</Text>
            <View style={[styles.inputBox, styles.equalHeightBox]}><Text>{book?.callNumber}</Text></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Borrow duration</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.inputBox, styles.dropdownBox, styles.equalHeightBox]}>
              <Text>{duration} {duration === 1 ? 'day' : 'days'}</Text>
              <Feather name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Location</Text>
            <View style={[styles.inputBox, styles.equalHeightBox, { backgroundColor: '#007AFF', borderColor: '#007AFF' }]}>
              <Text style={{ color: 'white' }}>{book?.rackLocation}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Due</Text>
            <View style={[styles.inputBox, styles.equalHeightBox]}>
                <Text>{dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.btnProceed}
        onPress={() => router.push({ 
            pathname: '/qr/MyQRScreen', 
            params: { mode: 'borrow', bookId, duration: duration.toString() } 
        })}
      >
        <Text style={styles.btnText}>Proceed</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.btnCancel}>Cancel</Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <ScrollView>
              {[...Array(14).keys()].map((i) => (
                <TouchableOpacity 
                  key={i + 1} 
                  style={styles.modalItem}
                  onPress={() => {
                    setDuration(i + 1);
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{i + 1} {i === 0 ? 'day' : 'days'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPicker(false)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white', paddingTop: Platform.OS === 'android' ? 25 : 0 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  backButton: { padding: 5 },
  container: { flex: 1, paddingHorizontal: 25, backgroundColor: 'white', alignItems: 'center' },
  mainCover: { width: 180, height: 260, borderRadius: 10, marginTop: 20, borderWidth: 4, borderColor: '#007AFF' },
  author: { color: 'grey', marginTop: 20, fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  form: { width: '100%', marginTop: 20 },
  label: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  inputBox: { borderWidth: 1, borderColor: '#DDD', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 15, justifyContent: 'center' },
  equalHeightBox: { minHeight: 56 },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnProceed: { backgroundColor: '#007AFF', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold' },
  btnCancel: { color: 'red', marginTop: 15, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseBtn: {
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  }
});