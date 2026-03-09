import React from 'react';
import { View, TextInput, FlatList, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';

export default function BookPage() {
  const books = useQuery(api.books.getAllBooks);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Recent Books</Text>
        <FlatList
          data={books}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={{ uri: item.coverImage }} style={styles.bookCover} />
              <Text style={styles.bookInfo} numberOfLines={2}>{item.title}</Text>
              <TouchableOpacity style={styles.seeNowBtn}>
                <Text style={{ color: 'white', fontSize: 10 }}>See now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerSection: { padding: 20, paddingTop: 10 },
  searchContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 45,
    justifyContent: 'center',
    marginBottom: 15,
  },
  searchInput: { fontSize: 16 },
  savedBtn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savedBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 15 },
  listContainer: { paddingHorizontal: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  bookCard: {
    backgroundColor: 'white',
    width: '46%',
    marginBottom: 20,
    marginHorizontal: '2%',
    borderRadius: 15,
    padding: 10,
    // Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookCover: { width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover' },
  bookInfo: { marginTop: 10, alignItems: 'center' },
  authorText: { fontSize: 10, color: COLORS.textSecondary },
  titleText: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 2, height: 35 },
  seeNowBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  seeNowText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }
});
