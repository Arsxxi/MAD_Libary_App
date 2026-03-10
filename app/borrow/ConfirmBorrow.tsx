import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore'; 
import { COLORS } from '../../utils/constants';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

const DURATION_OPTIONS = [1, 2, 3, 5, 7, 10, 14];

export default function ConfirmBorrowScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const book = useQuery(api.books.getBookById, { bookId: bookId as any });

  const [durationNumber, setDurationNumber] = useState(14);
  const [showDropdown, setShowDropdown] = useState(false);

  // hitung due date otomatis dari durationNumber
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + durationNumber);
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

            {/* ── DROPDOWN ── */}
            <TouchableOpacity
              style={[styles.inputBox, styles.dropdownBox]}
              onPress={() => setShowDropdown(true)}
            >
              <Text>{durationNumber} days</Text>
              <Feather name="chevron-down" size={18} color="black" />
            </TouchableOpacity>
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

      {/* ── MODAL PILIHAN DURASI ── */}
      <Modal visible={showDropdown} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownList}>
            <Text style={styles.dropdownTitle}>Pilih Durasi Pinjam</Text>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  durationNumber === option && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setDurationNumber(option);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  durationNumber === option && styles.dropdownItemTextActive,
                ]}>
                  {option} hari
                </Text>
                {durationNumber === option && (
                  <Feather name="check" size={16} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40, flexGrow: 1, alignItems: 'center' },
  container: { flex: 1, padding: 25, backgroundColor: 'white' },
  mainCover: { width: 180, height: 260, borderRadius: 10, marginTop: 40 },
  author: { color: 'grey', marginTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  form: { width: '100%', marginTop: 20 },
  label: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  inputBox: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 15 },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row' },
  btnProceed: { backgroundColor: '#007AFF', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold' },
  btnCancel: { color: 'red', marginTop: 15, fontWeight: 'bold' },
  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  dropdownList: { backgroundColor: 'white', borderRadius: 16, padding: 8, width: 260, elevation: 8 },
  dropdownTitle: { fontSize: 13, fontWeight: '600', color: '#64748B', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 4 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8 },
  dropdownItemActive: { backgroundColor: '#EFF6FF' },
  dropdownItemText: { fontSize: 15, color: '#1E293B' },
  dropdownItemTextActive: { color: '#007AFF', fontWeight: '600' },
});