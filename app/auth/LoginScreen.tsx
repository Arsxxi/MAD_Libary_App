import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppStore } from '../../store/useAppStore';

const ScatteredLetter = ({ letter, color = '#1E3A8A', bgColor = '#F8FAFC', rotate = '0deg', top = 0, left = 0 }: any) => (
  <View style={[styles.letterBox, { backgroundColor: bgColor, transform: [{ rotate }], top, left, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }]}>
    <Text style={[styles.letterText, { color }]}>{letter}</Text>
  </View>
);

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
        router.replace('/tabs');
      }
    } catch (error: any) {
      // Menangkap error yang dilempar dari Convex (misal: "Password salah.")
      Alert.alert("Login Gagal", error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSection}>
        <View style={styles.headerRow}>
          <Text style={styles.logoText}>U. BOOK</Text>
          <Feather name="book-open" size={24} color="white" />
        </View>

        <View style={styles.lettersContainer}>
          <View style={[styles.wordRow, { justifyContent: 'center', marginLeft: -50 }]}>
            <ScatteredLetter letter="U" color="#F8FAFC" bgColor="#1E3A8A" rotate="-15deg" top={25} left={0} />
            <ScatteredLetter letter="N" color="#1E3A8A" bgColor="#F8FAFC" rotate="10deg" top={5} left={10} />
            <ScatteredLetter letter="K" color="#F8FAFC" bgColor="#1E3A8A" rotate="-2deg" top={0} left={20} />
            <ScatteredLetter letter="L" color="#1E3A8A" bgColor="#F8FAFC" rotate="5deg" top={0} left={30} />
            <ScatteredLetter letter="A" color="#F8FAFC" bgColor="#1E3A8A" rotate="-8deg" top={5} left={40} />
            <ScatteredLetter letter="B" color="#1E3A8A" bgColor="#F8FAFC" rotate="15deg" top={25} left={50} />
          </View>
          <View style={[styles.wordRow, { marginTop: 90, justifyContent: 'center', marginLeft: -58 }]}>
            <ScatteredLetter letter="L" color="#1E3A8A" bgColor="#F8FAFC" rotate="-12deg" top={15} left={0} />
            <ScatteredLetter letter="I" color="#F8FAFC" bgColor="#1E3A8A" rotate="5deg" top={5} left={10} />
            <ScatteredLetter letter="B" color="#1E3A8A" bgColor="#F8FAFC" rotate="-5deg" top={0} left={20} />
            <ScatteredLetter letter="R" color="#F8FAFC" bgColor="#1E3A8A" rotate="8deg" top={-5} left={30} />
            <ScatteredLetter letter="A" color="#1E3A8A" bgColor="#F8FAFC" rotate="-3deg" top={-5} left={40} />
            <ScatteredLetter letter="R" color="#F8FAFC" bgColor="#1E3A8A" rotate="5deg" top={0} left={50} />
            <ScatteredLetter letter="Y" color="#1E3A8A" bgColor="#F8FAFC" rotate="-10deg" top={15} left={60} />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>LOG IN</Text>
          <Text style={styles.subtitle}>Akses perpustakaan digital Anda</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottomSection}>
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

        <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/admin')}>
          <Ionicons name="person" size={14} color="white" />
          <Text style={styles.adminButtonText}>Admin login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Mahasiswa baru? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/RegisterScreen')}>
            <Text style={styles.registerLink}>Daftar Akun</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007AFF' },
  topSection: { flex: 1, paddingTop: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginBottom: 40 },
  logoText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  lettersContainer: { flex: 1, paddingHorizontal: 40, justifyContent: 'center' },
  wordRow: { flexDirection: 'row', position: 'relative' },
  letterBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  letterText: { fontSize: 26, fontWeight: 'bold' },
  titleContainer: { paddingHorizontal: 30, marginBottom: 30 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: 'white', fontSize: 14, fontWeight: '600' },
  bottomSection: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 30, paddingTop: 50, paddingBottom: 60, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  inputLabel: { fontSize: 10, color: '#9CA3AF', marginBottom: 5, marginLeft: 5, fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 15, marginBottom: 20, height: 60 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1F2937', fontSize: 14, fontWeight: '500' },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 16, height: 60, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  adminButton: { backgroundColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginTop: 15 },
  adminButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#9CA3AF', fontSize: 12, fontWeight: '500' },
  registerLink: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
});