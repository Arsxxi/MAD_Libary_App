import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 25 : 15,
          left: 15,
          right: 15,
          backgroundColor: '#FFFFFF',
          borderRadius: 45,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          height: 85,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={focused ? '#007AFF' : '#000000'} />
          ),
        }}
      />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'BOOKS',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={28} color={focused ? '#007AFF' : '#000000'} />
          ),
        }}
      />

      {/* QR TENGAH — kotak bersudut tumpul (rounded square) */}
      <Tabs.Screen
        name="qr"
        options={{
          title: 'QR Saya',
          tabBarIcon: () => (
            <View style={styles.qrWrapper}>
              <Ionicons name="qr-code" size={32} color="white" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="loans"
        options={{
          title: 'Peminjaman',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={28} color={focused ? '#007AFF' : '#000000'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={focused ? '#007AFF' : '#000000'} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  qrWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#007AFF', // Modern Blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? -5 : 2,
  },
});