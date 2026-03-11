import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export default function Index() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const stored = await SecureStore.getItemAsync('campus_library_user_id');
      setUserId(stored); // null kalau tidak ada, string kalau ada
    } catch {
      setUserId(null);
    }
  }

  // validasi userId ke Convex — skip kalau belum ada userId
  const user = useQuery(
    api.auth.getUserById,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  );

  useEffect(() => {
    if (userId === undefined) return; // masih loading SecureStore

    if (!userId) {
      // tidak ada userId → ke login
      router.replace('/auth/LoginScreen');
      return;
    }

    if (user === undefined) return; // masih loading Convex

    if (user === null) {
      // userId ada tapi tidak valid di DB → hapus dan ke login
      SecureStore.deleteItemAsync('campus_library_user_id');
      router.replace('/auth/LoginScreen');
      return;
    }

    // user valid → ke navigation
    if (user.role === 'staff') {
      router.replace('/admin');
    } else {
      router.replace('/(tabs)');
    }

  }, [userId, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={{ marginTop: 12, color: '#64748B', fontSize: 13 }}>
        Memuat...
      </Text>
    </View>
  );
}
