import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';

import BookCard from '../../components/BookCard';
import { COLORS } from '../../utils/constants';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const books = useQuery(api.books.getAllBooks);

  if (books === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Memuat data perpustakaan...</Text>
      </View>
    );
  }

  const recommendations = books.slice(0, 3);
  const popularBooks = books.slice(0, 5);
  const recentBooks = books.slice(books.length - 5).reverse();

  return (
    <ScrollView style={styles.container} bounces={false}>
      
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Hello Clio</Text>
        <Text style={styles.headerSubtitle}>Let's Start Reading</Text>
        <Text style={styles.sectionTitleWhite}>Recommendation</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recommendations.map((book) => (
            <BookCard 
              key={book._id}
              bookId={book._id}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage}
              onPress={() => router.push({
                pathname: '/book/BookDetailScreen',
                params: { bookId: book._id }
              })}
              isHorizontal={true}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentSection}>
        
       

        <Text style={styles.sectionTitleDark}>Popular Books</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {popularBooks.map((book) => (
            <BookCard 
              key={`popular-${book._id}`}
              bookId={book._id}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage}
              onPress={() => router.push({
                pathname: '/book/BookDetailScreen',
                params: { bookId: book._id }
              })}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitleDark}>Recent Books</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recentBooks.map((book) => (
            <BookCard 
              key={`recent-${book._id}`}
              bookId={book._id}
              title={book.title}
              author={book.author}
              imageUrl={book.coverImage}
              onPress={() => router.push({
                pathname: '/book/BookDetailScreen',
                params: { bookId: book._id }
              })}
            />
          ))}
        </ScrollView>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  headerSection: { paddingHorizontal: 15, paddingTop: 20, backgroundColor: COLORS.primary },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 , marginTop : 20},
  headerSubtitle: { fontSize: 14, color: COLORS.white, marginBottom: 20 },
  sectionTitleWhite: { fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginBottom: 10 },
  sectionTitleDark: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  contentSection: { paddingHorizontal: 20, paddingVertical: 20 },
  searchContainer: { marginBottom: 20 },
  searchInput: { borderWidth: 1, borderColor: COLORS.textSecondary, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, color: COLORS.text },
  horizontalScroll: { marginBottom: 20 },
});