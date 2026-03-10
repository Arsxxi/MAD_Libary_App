import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Mock Data
const MOCK_DATA = [
  { id: '1', author: 'Brian khrisna', title: 'Seporsi mie ayam sebelum mati', status: 'Returned' },
  { id: '2', author: 'Brian khrisna', title: 'Seporsi mie ayam sebelum mati', status: 'In box' },
  { id: '3', author: 'Brian khrisna', title: 'Seporsi mie ayam sebelum mati', status: 'Returned' },
  { id: '4', author: 'Brian khrisna', title: 'Seporsi mie ayam sebelum mati', status: 'In box' },
  { id: '5', author: 'Brian khrisna', title: 'Seporsi mie ayam sebelum mati', status: 'Returned' },
];

export default function ReturnList() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: any) => {
    const isReturned = item.status === 'Returned';
    
    return (
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Cover</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <View style={styles.cardAction}>
          <TouchableOpacity 
            style={[
              styles.dropdownButton, 
              isReturned ? styles.dropdownReturned : styles.dropdownInbox
            ]}
          >
            <Text 
              style={[
                styles.dropdownText, 
                isReturned ? styles.dropdownTextReturned : styles.dropdownTextInbox
              ]}
            >
              {item.status}
            </Text>
            <MaterialIcons 
              name="arrow-drop-down" 
              size={20} 
              color={isReturned ? "white" : "black"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Set Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
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
  backButton: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
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
  imagePlaceholder: {
    width: 60,
    height: 80,
    backgroundColor: '#374151',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: 'white',
    fontSize: 10,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  author: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '500',
    lineHeight: 22,
  },
  cardAction: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    paddingTop: 45, // To align at the bottom right
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  dropdownReturned: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dropdownInbox: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 2,
  },
  dropdownTextReturned: {
    color: 'white',
  },
  dropdownTextInbox: {
    color: 'black',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 40, // More padding to match the image smaller button
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25, // More rounded 
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
