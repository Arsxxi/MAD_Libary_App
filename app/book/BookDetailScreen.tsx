import { useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Platform, Modal } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { COLORS } from '../../utils/constants';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

const DURATION_OPTIONS = [1, 2, 3, 5, 7, 10, 14];

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [duration, setDuration] = useState(14);
  const [showDropdown, setShowDropdown] = useState(false);

  // hitung due date otomatis dari durasi
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + duration);
  const formattedDueDate = dueDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toLowerCase();

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.imageWrapper}>
          <Image source={{ uri: book?.coverImage }} style={styles.mainCover} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.author}>{book?.author || 'Unknown Author'}</Text>
          <Text style={styles.title}>{book?.title || 'Unknown Title'}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Call number</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputText}>{book?.callNumber || '-'}</Text>
              </View>

              <Text style={styles.label}>Location</Text>
              <View style={[styles.inputBox, { backgroundColor: '#007AFF', borderColor: '#007AFF' }]}>
                <Text style={[styles.inputText, { color: 'white' }]}>{book?.rackLocation || '-'}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Borrow duration</Text>

              {/* ── DROPDOWN BUTTON ── */}
              <TouchableOpacity
                style={[styles.inputBox, styles.dropdownBox]}
                onPress={() => setShowDropdown(true)}
              >
                <Text style={styles.inputText}>{duration} days</Text>
                <Feather name="chevron-down" size={20} color="black" />
              </TouchableOpacity>

              <Text style={styles.label}>Due</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputText}>{formattedDueDate}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.btnProceed}
            disabled={book.availableCopies === 0}
            onPress={() => router.push({
              pathname: '/borrow/ConfirmBorrow',
              params: { bookId: book._id, duration, dueDate: dueDate.getTime() }
            })}
          >
            <Text style={styles.btnText}>Proceed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancelWrapper} onPress={() => router.back()}>
            <Text style={styles.btnCancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                  duration === option && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setDuration(option);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  duration === option && styles.dropdownItemTextActive,
                ]}>
                  {option} hari
                </Text>
                {duration === option && (
                  <Feather name="check" size={16} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
  scrollContent: { 
  paddingBottom: 40,
  flexGrow: 1,
  },
  backButton: { padding: 5 },
  container: { flex: 1, paddingHorizontal: 25 },
  imageWrapper: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  mainCover: { width: 200, height: 280 },
  textContainer: { marginBottom: 20 },
  author: { fontSize: 18, color: 'grey', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: '500', lineHeight: 32, color: 'black' },
  formContainer: { width: '100%', marginBottom: 30 },
  label: { marginBottom: 5, fontSize: 14, color: 'black', fontWeight: '500' },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  inputText: { fontSize: 13, fontWeight: '600' },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  actionContainer: { alignItems: 'center', width: '100%' },
  btnProceed: {
    backgroundColor: '#007AFF',
    width: 250,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnCancelWrapper: {
   
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  btnCancel: { color: 'red', fontWeight: 'bold', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    width: 260,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dropdownItemActive: { backgroundColor: '#EFF6FF' },
  dropdownItemText: { fontSize: 15, color: '#1E293B' },
  dropdownItemTextActive: { color: '#007AFF', fontWeight: '600' },
});