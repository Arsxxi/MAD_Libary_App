import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const userId = await SecureStore.getItemAsync('campus_library_user_id');
    if (userId) {
      router.replace('/navigation');  // sudah login → ke tab navigator
    } else {
      router.replace('/auth/login');  // belum login → ke login
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}