import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookmarksScreen() {
  const router = useRouter();
  const allBooks = useQuery(api.books.getAllBooks) || [];
  const bookmarkedBookIds = useAppStore(state => state.bookmarkedBookIds);

  // Filter buku yang ID-nya ada di dalam store bookmark
  const savedBooks = allBooks.filter(book => bookmarkedBookIds.has(book._id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Books</Text>
        <View style={{ width: 38 }} />
      </View>

      {savedBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Belum ada buku yang disimpan.</Text>
        </View>
      ) : (
        <FlatList
          data={savedBooks}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: item._id }})}>
                {item.coverImage ? (
                  <Image source={{ uri: item.coverImage }} style={styles.coverImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.coverImage, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.btnSeeNow}
                onPress={() => router.push({ pathname: '/book/BookDetailScreen', params: { bookId: item._id }})}
              >
                <Text style={styles.btnSeeNowText}>See now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },

  listContainer: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    marginBottom: 15,
  },
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  author: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
    minHeight: 35,
  },
  btnSeeNow: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSeeNowText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});