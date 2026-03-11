import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const STATUS_OPTIONS = ['returned', 'in box'];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  returned:  { bg: '#007AFF', text: 'white',   border: '#007AFF' },
  borrowed:  { bg: 'white',   text: 'black',   border: '#E5E7EB' },
  overdue:   { bg: '#FF3B30', text: 'white',   border: '#FF3B30' },
  lost:      { bg: '#374151', text: 'white',   border: '#374151' },
  in_box:    { bg: 'white',   text: 'black',   border: '#E5E7EB' },
  due_soon:  { bg: '#FF9500', text: 'white',   border: '#FF9500' },
};

export default function Proccesbox() {
  const [search, setSearch] = useState('');
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  
  const transactions = useQuery(api.transactions.getInBoxTransactions) ?? [];
  const returnViaCounter = useMutation(api.transactions.returnViaCounter);

  const filtered = transactions.filter((t: any) =>
    (t.book?.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (t.book?.author ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (item: any) =>
    localStatuses[item._id] ?? item.status ?? 'borrowed';

  const handleSetStatus = async () => {
    for (const [transactionId, status] of Object.entries(localStatuses)) {
      if (status === 'returned') {
        try {
          await returnViaCounter({ transactionId: transactionId as Id<'transactions'> });
        } catch (e) {}
      }
    }
    setLocalStatuses({});
  };

  const renderItem = ({ item }: any) => {
    const status = getStatus(item);
    const colors = STATUS_COLORS[status] ?? STATUS_COLORS.borrowed;
    const isOpen = dropdownOpenId === item._id;

    return (
      <View style={styles.card}>
        {item.book?.coverImage ? (
          <Image source={{ uri: item.book?.coverImage ?? undefined }} style={styles.coverImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Cover</Text>
          </View>
        )}

         <View style={styles.cardContent}>
            <Text style={styles.author} numberOfLines={1}>{item.book?.author ?? '-'}</Text>
            <Text style={styles.title} numberOfLines={2}>{item.book?.title ?? '-'}</Text>
         </View>

          <View style={styles.cardAction}>
            <TouchableOpacity
              style={[styles.dropdownButton, { backgroundColor: colors.bg, borderColor: colors.border }]}
              onPress={(e) => {
                const { pageY, pageX } = e.nativeEvent;
                setDropdownPosition({ top: pageY + 10, right: 20 });
                setDropdownOpenId(dropdownOpenId === item._id ? null : item._id);
              }}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
      </View>
    );
  };

  if (transactions === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
      </View>
      
      
      {/* GLOBAL DROPDOWN MODAL */}
      <Modal visible={dropdownOpenId !== null} transparent animationType="none">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setDropdownOpenId(null)}
        >
          <View style={[styles.dropdownList, { 
            position: 'absolute', 
            top: dropdownPosition.top, 
            right: dropdownPosition.right 
          }]}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownOption}
                onPress={() => {
                  if (dropdownOpenId) {
                    setLocalStatuses(prev => ({ ...prev, [dropdownOpenId]: opt }));
                  }
                  setDropdownOpenId(null);
                }}
              >
                <Text style={styles.dropdownOptionText}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada transaksi aktif</Text>
          </View>
        }
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSetStatus}>
          <Text style={styles.actionButtonText}>Set Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: { paddingHorizontal: 20, marginTop: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalOverlay: {
  flex: 1,
},
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  searchIcon: { marginLeft: 10 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    alignItems: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  coverImage: { width: 60, height: 80, borderRadius: 4 },
  imagePlaceholder: {
    width: 60,
    height: 80,
    backgroundColor: '#374151',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: { color: 'white', fontSize: 10 },
  cardContent: { flex: 1, marginLeft: 15, marginRight: 10, justifyContent: 'center' },
  author: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  title: { fontSize: 16, color: '#111827', fontWeight: '500', lineHeight: 22 },
  cardAction: { alignItems: 'flex-end', justifyContent: 'flex-end', position: 'relative' },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 90,
    justifyContent: 'space-between',
  },
  dropdownText: { fontSize: 11, fontWeight: 'bold', marginRight: 2 },
  dropdownList: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 10,
    zIndex: 999,
    minWidth: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownOptionText: { fontSize: 13, color: '#111827' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#6B7280', fontSize: 15 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});