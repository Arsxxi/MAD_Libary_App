// app/components/BookCard.tsx
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../utils/constants";

interface BookCardProps {
  bookId: string;
  title: string;
  author: string;
  imageUrl?: string; // --- UBAH: Sekarang menggunakan string (URL dari Convex) ---
  onPress?: () => void;
  customButtonText?: string;
  isHorizontal?: boolean;
}

export default function BookCard({
  bookId,
  title,
  author,
  imageUrl,
  onPress,
  customButtonText = "See now",
  isHorizontal = false,
}: BookCardProps) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  const bgColor = isDarkMode ? "#1F2937" : COLORS.white;
  const titleColor = isDarkMode ? "#F9FAFB" : COLORS.textMain;
  const authorColor = isDarkMode ? "#9CA3AF" : COLORS.textSecondary;
  const borderColor = isDarkMode ? "#374151" : "transparent";
  const imageSource = imageUrl
    ? { uri: imageUrl }
    : require("../assets/images/icon.png");

  // ← routing ke BookDetail
  function handlePress() {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/book/BookDetailScreen",
        params: { bookId },
      });
    }
  }

  if (isHorizontal) {
    return (
      <TouchableOpacity
        style={[
          styles.cardContainer,
          styles.horizontalContainer,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: isDarkMode ? 1 : 0,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image
          source={imageSource}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalTextContainer}>
          <Text style={[styles.authorText, { color: authorColor }]}>
            {author}
          </Text>
          <Text
            style={[styles.titleText, { color: titleColor }]}
            numberOfLines={3}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: isDarkMode ? 1 : 0,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.authorText, { color: authorColor }]}>
          {author}
        </Text>
        <Text
          style={[styles.titleText, { color: titleColor }]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
        <Text style={styles.buttonText}>{customButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* --- WRAPPER UTAMA CARD --- */
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius + 4,
    padding: 12,
    marginRight: 16,
    marginBottom: 16,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },
  horizontalContainer: {
    flexDirection: "row",
    width: 260,
    height: 100,
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-start",
  },
  horizontalImage: {
    width: 55,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  horizontalTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  /* --- BAGIAN GAMBAR --- */
  imageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  bookImage: {
    width: "100%",
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
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  /* --- BAGIAN TOMBOL --- */
  actionButton: {
    backgroundColor: "#007AFF", // Matches the design's bright blue exact color
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
