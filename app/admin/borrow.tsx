import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function BorrowList() {
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const books = useQuery(api.books.getAllBooks) ?? [];
  const borrowBooks = useMutation(api.transactions.borrowBooks);

  const filtered = books.filter((b: any) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const getQty = (bookId: string) => quantities[bookId] ?? 0;

  const increment = (bookId: string, maxStock: number) => {
    const current = getQty(bookId);
    if (current >= maxStock) return;
    setQuantities(prev => ({ ...prev, [bookId]: current + 1 }));
  };

  const decrement = (bookId: string) => {
    const current = getQty(bookId);
    if (current <= 0) return;
    setQuantities(prev => ({ ...prev, [bookId]: current - 1 }));
  };

  const selectedItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([bookId, quantity]) => ({ bookId: bookId as Id<'books'>, quantity }));

  const handleSetBorrowed = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Pilih Buku', 'Pilih minimal 1 buku terlebih dahulu.');
      return;
    }
    // navigate ke scan QR, bawa selectedItems sebagai params
    router.push({
      pathname: '/admin/scan-borrow',
      params: { items: JSON.stringify(selectedItems) }
    });
  };

  const renderItem = ({ item }: any) => {
    const qty = getQty(item._id);
    return (
      <View style={styles.card}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>Cover</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        </View>

        <View style={styles.cardAction}>
          <Text style={styles.stock}>Stok : {item.availableCopies}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => decrement(item._id)}>
              <Ionicons name="remove-circle" size={24} color={qty <= 0 ? '#CCC' : '#007AFF'} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{qty}</Text>
            <TouchableOpacity onPress={() => increment(item._id, item.availableCopies)}>
              <Ionicons name="add-circle" size={24} color={qty >= item.availableCopies ? '#CCC' : '#007AFF'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (books === undefined) {
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

      {selectedItems.length > 0 && (
        <View style={styles.selectedBanner}>
          <Text style={styles.selectedText}>
            {selectedItems.reduce((a, b) => a + b.quantity, 0)} buku dipilih
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada buku</Text>
          </View>
        }
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.actionButton, selectedItems.length === 0 && styles.actionButtonDisabled]}
          onPress={handleSetBorrowed}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.actionButtonText}>Set Borrowed</Text>
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
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  searchIcon: { marginLeft: 10 },
  selectedBanner: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  selectedText: { color: '#007AFF', fontWeight: '600', fontSize: 13 },
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
  cardContent: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  author: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  title: { fontSize: 16, color: '#111827', fontWeight: '500', lineHeight: 22 },
  cardAction: { justifyContent: 'space-between', alignItems: 'flex-end', minWidth: 80 },
  stock: { color: '#007AFF', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantity: { marginHorizontal: 10, fontSize: 16, fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#6B7280', fontSize: 15 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: { backgroundColor: '#93C5FD' },
  actionButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});