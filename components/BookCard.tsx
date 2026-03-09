// app/components/BookCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

interface BookCardProps {
  title: string;
  author: string;
  imageUrl?: string; // --- UBAH: Sekarang menggunakan string (URL dari Convex) ---
  onPress: () => void;
  customButtonText?: string;
  isHorizontal?: boolean;
}

export default function BookCard({ 
  title, 
  author, 
  imageUrl, 
  onPress, 
  customButtonText = "See now", 
  isHorizontal = false 
}: BookCardProps) {
  
  // --- LOGIKA FALLBACK GAMBAR ---
  // Jika buku tidak punya coverImage di database, pakai gambar default
  const imageSource = imageUrl 
    ? { uri: imageUrl } 
    : require('../assets/images/icon.png'); 

  return (
    <View style={[styles.cardContainer, isHorizontal ? styles.horizontalSize : styles.verticalSize]}>
      <View style={styles.imageContainer}>
        {/* --- STYLING GAMBAR (Terima URI dari Convex) --- */}
        <Image source={imageSource} style={styles.bookImage} resizeMode="cover" />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.authorText}>{author}</Text>
        <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <Text style={styles.buttonText}>{customButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* --- WRAPPER UTAMA CARD --- */
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 12,
    marginRight: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow untuk Android
    justifyContent: 'space-between',
  },
  horizontalSize: {
    width: 200,
  },
  verticalSize: {
    width: 160,
  },
  /* --- BAGIAN GAMBAR --- */
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bookImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  /* --- BAGIAN TEKS --- */
  textContainer: {
    marginBottom: 12,
  },
  authorText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  /* --- BAGIAN TOMBOL --- */
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
});