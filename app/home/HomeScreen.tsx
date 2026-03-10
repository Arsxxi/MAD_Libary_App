import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

import BookCard from '../../components/BookCard';
import { COLORS } from '../../utils/constants';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { userId } = useAuth();

  const profile = useQuery(
    api.users.getProfile, 
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );

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
    <View style={styles.mainContainer}>
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Blue Header Section */}
        <View style={styles.headerSection}>
          <SafeAreaView>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Hello {profile ? profile.name.split(' ')[0] : 'User'}</Text>
              <Text style={styles.headerSubtitle}>Let's Start Reading</Text>
            </View>
            
            <View style={styles.recContainer}>
              <Text style={styles.sectionTitleWhite}>Reccomendation</Text>
              <View style={styles.recScrollWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.horizontalScrollBounded}
                  contentContainerStyle={styles.horizontalScrollContentBounded}
                >
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
            </View>
          </SafeAreaView>
        </View>

        {/* Content Section below curve */}
        <View style={styles.contentSection}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Feather name="search" size={20} color="#555" style={styles.searchIcon} />
          </View>

          <Text style={styles.sectionTitleDark}>Popular Books</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.horizontalScrollBottom}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
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

          <Text style={styles.sectionTitleDarkRight}>Recent Books</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.horizontalScrollBottom}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  
  headerSection: { 
    backgroundColor: '#007AFF', 
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0
  },
  headerTextContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 25 },
  
  recContainer: { marginTop: 10 },
  sectionTitleWhite: { fontSize: 18, fontWeight: '500', color: COLORS.white, marginBottom: 10, paddingHorizontal: 20 },
  recScrollWrapper: { marginHorizontal: 1, overflow: 'hidden' },
  horizontalScrollBounded: { flexGrow: 0 },
  horizontalScrollContentBounded: { paddingRight: 5, paddingBottom: 5 },
  
  contentSection: { 
    paddingTop: 30,
  },
  
  searchContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  searchIcon: { marginLeft: 10 },

  sectionTitleDark: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 15, paddingHorizontal: 20 },
  sectionTitleDarkRight: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 15, paddingHorizontal: 20, textAlign: 'right' },
  horizontalScrollBottom: { flexGrow: 0, marginBottom: 20 },
});