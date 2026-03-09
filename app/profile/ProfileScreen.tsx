// app/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { COLORS } from '../../utils/constants';

export default function ProfileScreen() {
  const profile = useQuery(api.users.getProfile, { userId: "user_id_anda" as any });

  if (!profile) return null;

  return (
    <View style={styles.container}>
      {/* --- HEADER PROFIL --- */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{profile.name[0]}</Text>
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userNim}>{profile.nim}</Text>
      </View>

      {/* --- STATS GRID (DARI CONVEX STATS) --- */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile.stats.totalBorrowed}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' }]}>
          <Text style={styles.statNumber}>{profile.stats.currentlyBorrowed}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: 'red' }]}>{profile.stats.lateCount}</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
      </View>

      {/* --- MENU OPTIONS --- */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>My Digital ID (QR)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Library Rules</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { marginTop: 40 }]}>
          <Text style={[styles.menuText, { color: 'red' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  /* --- HEADER STYLING --- */
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: COLORS.primary },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarInitial: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
  userName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  userNim: { color: 'white', opacity: 0.8 },
  /* --- STATS STYLING --- */
  statsContainer: { flexDirection: 'row', margin: 20, padding: 20, borderRadius: 16, backgroundColor: COLORS.white, elevation: 4, marginTop: -30 },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  /* --- MENU STYLING --- */
  menuSection: { padding: 20 },
  menuItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuText: { fontSize: 16, color: COLORS.textMain }
});