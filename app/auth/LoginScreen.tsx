import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore'; // Import Zustand

export default function LoginScreen() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ambil fungsi setUser dari Zustand
  const setUser = useAppStore((state) => state.setUser);
  
  // Panggil mutasi login dari convex/auth.ts
  const loginMutation = useMutation(api.auth.login);

  const handleLogin = async () => {
    if (!nim || !password) {
      Alert.alert("Peringatan", "NIM dan Password tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    try {
      // Eksekusi fungsi login di Convex
      const result = await loginMutation({ nim, password });
      
      if (result.success) {
        // 1. Simpan ID ke SecureStore untuk sesi login persisten
        await SecureStore.setItemAsync('campus_library_user_id', result.user._id);
        
        // 2. Simpan data user ke Zustand Store agar bisa dipakai di seluruh aplikasi
        setUser(result.user);
        
        // 3. Arahkan ke halaman utama
        router.replace('/home/HomeScreen');
      }
    } catch (error: any) {
      // Menangkap error yang dilempar dari Convex (misal: "Password salah.")
      Alert.alert("Login Gagal", error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.logoText}>U. BOOK</Text>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>U</Text>
        </View>
        <Text style={styles.title}>LOG IN</Text>
        <Text style={styles.subtitle}>Akses perpustakaan digital Anda</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.inputLabel}>NIM MAHASISWA</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="id-card-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Masukkan NIM"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={nim}
            onChangeText={setNim}
          />
        </View>

        <Text style={styles.inputLabel}>PASSWORD</Text>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>MASUK</Text>}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Mahasiswa baru? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/RegisterScreen')}>
            <Text style={styles.registerLink}>Daftar Akun</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007AFF' },
  topSection: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, paddingTop: 50 },
  logoText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  logoBox: { backgroundColor: 'white', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  logoLetter: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: 'white', fontSize: 14, marginBottom: 20 },
  bottomSection: { flex: 1.2, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 30, paddingTop: 40 },
  inputLabel: { fontSize: 10, color: '#9CA3AF', marginBottom: 5, marginLeft: 5, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1F2937', fontSize: 14 },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 12, height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#9CA3AF', fontSize: 12 },
  registerLink: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
});