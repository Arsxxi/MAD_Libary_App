import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';

import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const user = useAppStore(state => state.user);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Welcome {user?.name ?? 'Admin'}  {/* ← nama dari store */}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/scan-options')}>
          <MaterialCommunityIcons name="qrcode-scan" size={32} color="#007AFF" style={styles.icon} />
          <Text style={styles.cardText}>Return Book QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/borrow')}>
          <MaterialCommunityIcons name="qrcode-scan" size={32} color="#007AFF" style={styles.icon} />
          <Text style={styles.cardText}>Borrow Book QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <Ionicons name="person" size={32} color="#007AFF" style={styles.icon} />
          <Text style={styles.cardText}>Logout</Text>
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
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  icon: {
    marginRight: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
