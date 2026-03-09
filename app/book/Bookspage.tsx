import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';
import BookCard from '../../components/BookCard';

export default function BookPage() {
  const books = useQuery(api.books.getAllBooks);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  if (books === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Memuat buku...</Text>
      </View>
    );
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Cari judul atau penulis..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredBooks}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Hasil: "${searchQuery}"` : 'Semua Buku'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Buku tidak ditemukan</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BookCard
            bookId={item._id}
            title={item.title}
            author={item.author}
            imageUrl={item.coverImage}
            onPress={() => router.push({
              pathname: '/book/BookDetailScreen',
              params: { bookId: item._id }
            })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  searchContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginTop: 65,
    height: 45,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 22,
  },
  searchInput: { fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 4, marginBottom: 12 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  columnWrapper: { justifyContent: 'space-between' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});