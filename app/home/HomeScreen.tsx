// app/home/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
// --- IMPORT CONVEX ---
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import BookCard from '../../components/BookCard';
import { COLORS } from '../../utils/constants';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // --- INTEGRASI CONVEX: AMBIL DATA SEMUA BUKU ---
  // Memanggil fungsi getAllBooks dari convex/book.ts
  const books = useQuery(api.books.getAllBooks);

  // --- STYLING LOADING STATE ---
  // Tampilkan spinner jika data belum selesai di-fetch
  if (books === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Memuat data perpustakaan...</Text>
      </View>
    );
  }

  // Simulasi pembagian kategori (bisa kamu sesuaikan logikanya nanti)
  const recommendations = books.slice(0, 3);
  const popularBooks = books.slice(0, 5);
  const recentBooks = books.slice(books.length - 5).reverse();

  return (
    <ScrollView style={styles.container} bounces={false}>
      
      <View style={styles.headerSection}>
        {/* Nantinya "Clio" bisa diganti dengan data dari useQuery(api.user.getProfile) */}
        <Text style={styles.headerTitle}>Hello Clio</Text>
        <Text style={styles.headerSubtitle}>Let's Start Reading</Text>

        <Text style={styles.sectionTitleWhite}>Recommendation</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {/* --- RENDER DATA DARI CONVEX --- */}
          {recommendations.map((book) => (
            <BookCard 
              key={book._id}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage} // Ambil field coverImage dari database
              onPress={() => {
                // Navigasi ke BookDetailScreen sambil mengirim book._id
                // router.push(`/catalog/${book._id}`)
              }}
              isHorizontal={true}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentSection}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            // Nantinya onSubmitEditing bisa diarahkan ke CatalogScreen dengan membawa searchQuery
          />
        </View>

        <Text style={styles.sectionTitleDark}>Popular Books</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {popularBooks.map((book) => (
            <BookCard 
              key={`popular-${book._id}`}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage} 
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitleDark}>Recent Books</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recentBooks.map((book) => (
            <BookCard 
              key={`recent-${book._id}`}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage} 
              onPress={() => {}}
            />
          ))}
        </ScrollView>

      </View>
    </ScrollView>
  );
}

// ... (Tambahkan styles.loadingContainer di bawah)
const styles = StyleSheet.create({
  // ... (style sebelumnya tetap sama)
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 20,
  },
  sectionTitleWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  sectionTitleDark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 10,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textMain,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
});