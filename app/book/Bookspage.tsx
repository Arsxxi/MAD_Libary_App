import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';
import { Feather } from '@expo/vector-icons';

// Local specific component matching the requested user design
const CatalogCard = ({ book, onPress, containerStyle }: { book: any, onPress: () => void, containerStyle?: any }) => (
  <TouchableOpacity style={[styles.cardContainer, containerStyle]} onPress={onPress} activeOpacity={0.8}>
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

        {/* Saved Book Action Row */}
        <View style={styles.topActionRow}>
          <TouchableOpacity style={styles.savedBookBtn}>
            <Text style={styles.savedBookText}>Saved book</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Slider (Top picks/Saved etc) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {filteredBooks.slice(0, 4).map((book) => (
            <CatalogCard 
              key={`top-${book._id}`} 
              book={book}
              containerStyle={styles.cardContainerHorizontal}
              onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: book._id } })} 
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          {searchQuery ? `Hasil: "${searchQuery}"` : 'Recent Books'}
        </Text>

        {/* Grid List */}
        <View style={styles.gridWrapper}>
          {filteredBooks.map((book) => (
            <CatalogCard 
              key={`grid-${book._id}`} 
              book={book} 
              onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: book._id } })} 
            />
          ))}
        </View>

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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    marginHorizontal: 15,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardContainerHorizontal: {
  backgroundColor: '#FFF',
  borderWidth: 1.5,
  borderColor: '#E8E8E8',
  borderRadius: 16,
  padding: 10,
  width: 190,        // ← fixed width, tidak terlalu lebar
  marginRight: 12,
},
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  topActionRow: { alignItems: 'flex-end', paddingHorizontal: 15, marginBottom: 20 },
  savedBookBtn: {
    backgroundColor: '#007AFF', // Exact bright blue
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  savedBookText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  horizontalContent: { paddingHorizontal: 15, paddingBottom: 10 },
  
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000',
    paddingHorizontal: 15, 
    marginBottom: 20,
    marginTop: 10,
  },
  
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },

  /* Card Components styling targeted to the new design */
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 10,
    width: '47%', // Specifically scaled to fit almost 3 elements across on normal width phone
    
    marginBottom: 15,
  },
  cardImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 8,
    flex: 1,
  },
  authorText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
  },
  cardBottom: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  seeNowBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,    // ← naikkan dari 5
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'stretch',  // ← tombol full width seperti di home
    alignItems: 'center',
  },
  seeNowText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
});