// app/profile/ProfileScreen.tsx
import { useQuery } from 'convex/react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Ganti import Clerk dengan useAuth lokal kamu
import { useAuth } from '../../hooks/useAuth'; // Sesuaikan path ke folder hooks/store kamu

export default function ProfileScreen() {
  // Ambil userId dari hook useAuth lokal kamu
  const { userId } = useAuth();

  // Tambahkan 'skip' jika userId kosong agar tidak muncul error validator
  const profile = useQuery(
    api.users.getProfile, 
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );

  // Loading state agar tidak null saat data diambil
  if (profile === undefined) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.container}>
      {/* Top Navigation Back Button */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- HEADER PROFIL --- */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Image source={{ uri: 'https://avatar.iran.liara.run/public' }} style={styles.avatarImage} />
          )}
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
      </View>

      {/* --- STATS CARD --- */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Feather name="book" size={32} color="#007AFF" />
          <Text style={styles.statLabel}>Books</Text>
          <Text style={styles.statNumber}>{profile.stats.totalBorrowed} books</Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="file-text" size={32} color="#007AFF" />
          <Text style={styles.statLabel}>Active</Text>
          <Text style={styles.statNumber}>{profile.stats.currentlyBorrowed} books</Text>
        </View>
        <View style={styles.statBox}>
          <Feather name="bookmark" size={32} color="#007AFF" />
          <Text style={styles.statLabel}>Saved</Text>
          {/* Menggunakan stats cadangan untuk "Saved", misalnya 32 */}
          <Text style={styles.statNumber}>32 books</Text>
        </View>
      </View>

      {/* --- LOGOUT BUTTON --- */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await SecureStore.deleteItemAsync('campus_library_user_id');
            router.replace('/auth/LoginScreen');
          }}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topNav: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  avatarCircle: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#D1E6F3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    overflow: 'hidden'
  },
  avatarImage: { width: 110, height: 110, borderRadius: 55 },
  userName: { color: 'black', fontSize: 32, fontWeight: 'bold' },
  
  statsCard: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    marginTop: 20,
    paddingVertical: 35, 
    paddingHorizontal: 15,
    borderRadius: 24, 
    backgroundColor: '#FFFFFF', 
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 15, marginBottom: 5 },
  statNumber: { fontSize: 13, fontWeight: '700', color: 'black' },
  
  menuSection: { alignItems: 'center', marginTop: 40 },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});