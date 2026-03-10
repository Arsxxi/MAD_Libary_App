import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';
import { Feather } from '@expo/vector-icons';

// Local specific component matching the requested user design
const CatalogCard = ({ book, onPress }: { book: any, onPress: () => void }) => (
  <View style={styles.cardWrapper}>
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: book.coverImage || 'https://via.placeholder.com/150' }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.authorText} numberOfLines={1}>{book.author || 'Unknown Author'}</Text>
        <Text style={styles.titleText} numberOfLines={2}>{book.title || 'Unknown Title'}</Text>
      </View>
      <View style={styles.cardBottom}>
        <TouchableOpacity style={styles.seeNowBtn} onPress={onPress}>
          <Text style={styles.seeNowText}>See now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
);

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={20} color="#888" />
        </View>

        {/* Popular Books */}
        <Text style={styles.sectionTitleLeft}>
          Popular Books
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {filteredBooks.map((book) => (
            <CatalogCard 
              key={`popular-${book._id}`} 
              book={book} 
              onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: book._id } })} 
            />
          ))}
        </ScrollView>

        {/* Recent Books */}
        <Text style={styles.sectionTitleRight}>
          Recent Books
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {filteredBooks.slice().reverse().map((book) => (
            <CatalogCard 
              key={`recent-${book._id}`} 
              book={book} 
              onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: book._id } })} 
            />
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginHorizontal: 15,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 20,
    marginBottom: 25,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  sectionTitleLeft: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000',
    paddingHorizontal: 20, 
    marginBottom: 15,
    textAlign: 'left'
  },

  sectionTitleRight: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000',
    paddingHorizontal: 20, 
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'right'
  },

  horizontalContent: { paddingHorizontal: 15, paddingBottom: 10 },
  
  /* Card Components styling targeted to the new design */
  cardWrapper: {
    marginRight: 15,
    marginBottom: 15,
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    width: 170, // Slightly wider for this design
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  textContainer: {
    marginBottom: 15,
    flex: 1,
  },
  authorText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    lineHeight: 18,
  },
  cardBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  seeNowBtn: {
    backgroundColor: '#007AFF', // Exact bright blue
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  seeNowText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold'
  },
});