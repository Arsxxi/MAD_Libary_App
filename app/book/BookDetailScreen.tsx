import { useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Platform, ScrollView } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useAppStore } from '../../store/useAppStore'; 
import { Ionicons } from '@expo/vector-icons';

export default function BookDetailScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();

  const book = useQuery(
    api.books.getBookById,
    bookId ? { bookId: bookId as Id<'books'> } : 'skip'
  );

  const allBooks = useQuery(api.books.getAllBooks) || [];
  const recommendations = allBooks.filter(b => b._id !== bookId).slice(0, 4);

  const isBookmarked = useAppStore(state => state.isBookmarked(bookId as Id<'books'>));
  const addBookmark = useAppStore(state => state.addBookmark);
  const removeBookmark = useAppStore(state => state.removeBookmark);

  const toggleBookmark = () => {
    if (!bookId) return;
    if (isBookmarked) {
      removeBookmark(bookId as Id<'books'>);
    } else {
      addBookmark(bookId as Id<'books'>);
    }
  };

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          {book.coverImage ? (
            <Image source={{ uri: book.coverImage }} style={styles.mainCover} resizeMode="cover" />
          ) : (
            <View style={[styles.mainCover, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
              <Text>No Image</Text>
            </View>
          )}
        </View>

        <Text style={styles.author}>{book.author || 'Unknown Author'}</Text>
        
        <View style={styles.titleRow}>
          <Text style={styles.title}>{book.title || 'Unknown Title'}</Text>
          <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={32} 
              color="black" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>Stok {book.availableCopies}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Books</Text>
          <Text style={styles.descriptionText}>
            "{book.title}" adalah buku karya {book.author}. {book.subject ? `Buku ini membahas tentang ${book.subject}.` : 'Silakan mengeksplorasi cerita atau materi yang ada di dalam buku ini di perpustakaan.'}
          </Text>
        </View>

        {recommendations.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitleRight}>Reccomendation</Text>
            <View style={styles.gridContainer}>
              {recommendations.map((rec) => (
                <View key={rec._id} style={styles.recCard}>
                  {rec.coverImage ? (
                    <Image source={{ uri: rec.coverImage }} style={styles.recCover} resizeMode="cover" />
                  ) : (
                    <View style={[styles.recCover, { backgroundColor: '#f0f0f0' }]} />
                  )}
                  <Text style={styles.recAuthor} numberOfLines={1}>{rec.author}</Text>
                  <Text style={styles.recTitle} numberOfLines={2}>{rec.title}</Text>
                  <TouchableOpacity 
                    style={styles.btnSeeNow}
                    onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: rec._id }})}
                  >
                    <Text style={styles.btnSeeNowText}>See now</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.btnBorrowFull}
          disabled={book.availableCopies === 0}
          onPress={() => router.push({ 
              pathname: '/borrow/ConfirmBorrow', 
              params: { bookId: book._id } 
          })}
        >
          <Text style={styles.btnBorrowFullText}>Borrow</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white', paddingTop: Platform.OS === 'android' ? 25 : 0 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  backButton: { padding: 5, alignSelf: 'flex-start' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  imageWrapper: { 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 30,
  },
  mainCover: { 
    width: 250, 
    height: 350,
  },
  
  author: { fontSize: 18, color: 'grey', marginBottom: 5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '500', color: 'black', flex: 1, marginRight: 10, lineHeight: 36 },
  bookmarkButton: { padding: 0 },

  stockBadge: { 
    borderWidth: 1, 
    borderColor: '#d0d0d0', 
    paddingHorizontal: 20, 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  stockText: { fontSize: 14, fontWeight: 'bold', color: 'black' },

  sectionContainer: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  sectionTitleRight: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: 'black', textAlign: 'right' },
  descriptionText: { fontSize: 15, color: '#333', lineHeight: 22, textAlign: 'justify' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recCard: { 
    width: '48%', 
    backgroundColor: 'white', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    padding: 15, 
    marginBottom: 15,
  },
  recCover: { width: '100%', height: 180, borderRadius: 6, marginBottom: 12 },
  recAuthor: { fontSize: 11, color: 'grey', marginBottom: 5 },
  recTitle: { fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 15, minHeight: 40, lineHeight: 18 },
  btnSeeNow: { backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnSeeNowText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'white', 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0' 
  },
  btnBorrowFull: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 16, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  btnBorrowFullText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});