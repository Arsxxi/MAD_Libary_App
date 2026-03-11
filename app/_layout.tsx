import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

import { useColorScheme } from '@/hooks/use-color-scheme';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/LoginScreen" />
          <Stack.Screen name="auth/RegisterScreen" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="home/HomeScreen" />
          <Stack.Screen name="book/BookDetailScreen" />
          <Stack.Screen name="book/Bookspage" />
          <Stack.Screen name="loans/MyLoansScreen" />
          <Stack.Screen name="loans/ReturnBooks" />
          
          <Stack.Screen name="profile/ProfileScreen" />
          <Stack.Screen name="qr/MyQRScreen" />
          <Stack.Screen name="qr/ScanQRScreen" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="admin/scan-borrow" />          {/* ← tambah ini */}
          <Stack.Screen name="borrow/ConfirmBorrow" />   {/* ← tambah ini juga kalau belum ada */}
          <Stack.Screen name="bookmarks/BookmarksScreen" /> 
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ConvexProvider>
  );
}