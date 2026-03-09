import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Panggil mutasi register dari convex/auth.ts
  const registerMutation = useMutation(api.auth.register);

  const handleRegister = async () => {
    if (!name || !nim || !email || !password) {
      Alert.alert("Peringatan", "Semua kolom harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      // Menyimpan data ke database melalui Convex
      const result = await registerMutation({ name, nim, email, password });
      
      if (result.success) {
        Alert.alert("Sukses", "Akun berhasil dibuat! Silakan Login dengan NIM dan Password Anda.", [
          { text: "OK", onPress: () => router.back() } // Kembali ke halaman login
        ]);
      }
    } catch (error: any) {
      // Menangkap error dari Convex (Misal: "NIM sudah terdaftar.")
      Alert.alert("Registrasi Gagal", error.message || "Terjadi kesalahan saat membuat akun.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Registrasi</Text>
        <Text style={styles.subtitle}>Akses perpustakaan digital Anda</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="NIM"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={nim}
            onChangeText={setNim}
          />

          <TextInput
            style={styles.input}
            placeholder="Email UNKLAB"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Buat Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>BUAT AKUN</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 50, paddingBottom: 30 },
  header: { marginBottom: 30 },
  backButton: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 30 },
  formContainer: { gap: 15 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, height: 55, paddingHorizontal: 15, fontSize: 14, color: '#1F2937' },
  registerButton: { backgroundColor: '#007AFF', borderRadius: 12, height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});