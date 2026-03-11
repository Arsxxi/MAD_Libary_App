import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!id || !password) {
        Alert.alert('Error', 'ID dan password harus diisi');
        return;
    }

    try {
        const result = await login(id, password);
        if (result?.success) {
        // redirect berdasarkan role
        if (result.role === 'staff') {
            router.replace('/admin');
        } else {
            router.replace('/(tabs)');
        }
        } else {
        Alert.alert('Login Gagal', result?.error ?? 'Terjadi kesalahan');
        }
    } catch (error: any) {
        Alert.alert('Login Gagal', error.message ?? 'Terjadi kesalahan');
    }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#333" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Login admin</Text>

        {/* ID Field */}
        <Text style={styles.fieldLabel}>ID</Text>
        <View style={styles.inputBox}>
          <Ionicons name="card-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Masukkan ID"
            placeholderTextColor="#AAAAAA"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#AAAAAA"
            />
          </TouchableOpacity>
        </View>

        {/* Masuk Button */}
        <TouchableOpacity
          style={styles.btnMasuk}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnMasukText}>MASUK</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 35,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  btnMasuk: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  btnMasukText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});