import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../utils/constants';
import { Feather } from '@expo/vector-icons';

const LoanCard = ({ item, routeStatus }: { item: any, routeStatus: string }) => {
  const router = useRouter();
  
  const coverImage = item.book?.coverImage;
  const title = item.book?.title ?? 'Judul tidak tersedia';
  const author = item.book?.author ?? 'Unknown Author';

  let daysLeftText = '';
  if (item.dueDate) {
    const due = new Date(item.dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    daysLeftText = diff === 1 ? '1 days\nremaining' : `${diff} days\nremaining`;
  } else {
    if (routeStatus === 'active') daysLeftText = '10 days\nremaining';
    if (routeStatus === 'due_soon') daysLeftText = '2 days\nremaining';
  }

  const handlePress = () => {
    router.push({
      pathname: '/loans/ReturnBooks',
      params: { transactionId: item._id }
    });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image 
          source={coverImage ? { uri: coverImage } : require('../../assets/images/icon.png')} 
          style={styles.cardImage} 
          resizeMode="contain" 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.authorText} numberOfLines={1}>{author}</Text>
        <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
      </View>

      <View style={styles.cardBottom}>
        {routeStatus === 'active' && (
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={[styles.statusButton, { backgroundColor: '#007AFF' }]}>
                <Text style={styles.buttonTextWhite}>Dipinjam</Text>
              </View>
              <Text style={{ color: '#007AFF', fontSize: 10, textAlign: 'right', fontWeight: '600' }}>{daysLeftText}</Text>
           </View>
        )}
        {routeStatus === 'due_soon' && (
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={[styles.statusButton, { backgroundColor: '#FFCC00' }]}>
                <Text style={[styles.buttonTextWhite, { color: 'black' }]}>Dipinjam</Text>
              </View>
              <Text style={{ color: '#007AFF', fontSize: 10, textAlign: 'right', fontWeight: '600' }}>{daysLeftText}</Text>
           </View>
        )}
        {routeStatus === 'overdue' && (
           <View style={{ alignItems: 'flex-end', width: '100%' }}>
              <View style={[styles.statusButton, { backgroundColor: '#FF0000', paddingHorizontal: 15 }]}>
                <Text style={styles.buttonTextWhite}>RP. {item.fineAmount || '21.000'}</Text>
              </View>
           </View>
        )}
        {routeStatus === 'in_box' && (
           <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={[styles.statusButton, { backgroundColor: 'white', borderWidth: 1, borderColor: '#007AFF', width: '80%' }]}>
                <Text style={[styles.buttonTextWhite, { color: '#007AFF' }]}>Waiting</Text>
              </View>
           </View>
        )}
        {routeStatus === 'returned' && (
           <View style={{ alignItems: 'center', width: '100%' }}>
              <View style={[styles.statusButton, { backgroundColor: '#007AFF', width: '80%' }]}>
                <Text style={styles.buttonTextWhite}>See now</Text>
              </View>
           </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MyLoansScreen() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const loans = useQuery(
    api.transactions.getActiveLoans,
    userId ? { userId: userId as Id<'users'> } : 'skip'
  ) ?? [];

  const activeLoans = loans.filter((l: any) => l.status === 'active');
  const dueSoonLoans = loans.filter((l: any) => l.status === 'due_soon');
  const overdueLoans = loans.filter((l: any) => l.status === 'overdue');
  const waitingLoans = loans.filter((l: any) => ['waiting', 'in_box'].includes(l.status));
  const returnedLoans = loans.filter((l: any) => l.status === 'returned');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} bounces={false}>
        
        {/* Title */}
        <Text style={styles.mainTitle}>Status</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder="Search"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Feather name="search" size={20} color="#888" />
        </View>

        {/* Top Active Section */}
        <View style={styles.headerRowSpaceBetween}>
          <View style={styles.pillOutline}>
            <Text style={styles.pillTextDark}>Report lost book</Text>
          </View>
          <View style={[styles.pillFilled, { backgroundColor: '#007AFF', paddingHorizontal: 25 }]}>
            <Text style={styles.pillTextWhite}>Active</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {activeLoans.length > 0 ? (
             activeLoans.map((item: any) => <LoanCard key={item._id} item={item} routeStatus="active" />)
          ) : (
             <Text style={styles.emptyText}>No active loans</Text>
          )}
        </ScrollView>

        {/* Due soon Section */}
        <View style={styles.headerRowSpaceBetween}>
          <View style={[styles.pillFilled, { backgroundColor: '#FFCC00', paddingHorizontal: 20 }]}>
            <Text style={[styles.pillTextWhite, { color: 'black' }]}>Due soon</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {dueSoonLoans.length > 0 ? (
             dueSoonLoans.map((item: any) => <LoanCard key={item._id} item={item} routeStatus="due_soon" />)
          ) : (
             <Text style={styles.emptyText}>No books due soon</Text>
          )}
        </ScrollView>

        {/* Overdue Section */}
        <View style={[styles.headerRowSpaceBetween, { justifyContent: 'flex-end' }]}>
          <View style={[styles.pillFilled, { backgroundColor: '#FF0000', paddingHorizontal: 20 }]}>
            <Text style={styles.pillTextWhite}>Overdue</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {overdueLoans.length > 0 ? (
             overdueLoans.map((item: any) => <LoanCard key={item._id} item={item} routeStatus="overdue" />)
          ) : (
             <Text style={styles.emptyText}>No overdue books</Text>
          )}
        </ScrollView>

        {/* In Box Section */}
        <View style={styles.headerRowSpaceBetween}>
          <View style={[styles.pillOutline, { borderColor: '#CCC' }]}>
            <Text style={[styles.pillTextDark, { color: '#007AFF' }]}>In box</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {waitingLoans.length > 0 ? (
             waitingLoans.map((item: any) => <LoanCard key={item._id} item={item} routeStatus="in_box" />)
          ) : (
             <Text style={styles.emptyText}>No books in box</Text>
          )}
        </ScrollView>

        {/* Returned Section */}
        <Text style={styles.returnedTitle}>Returned</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {returnedLoans.length > 0 ? (
             returnedLoans.map((item: any) => <LoanCard key={item._id} item={item} routeStatus="returned" />)
          ) : (
             <Text style={styles.emptyText}>No returned books</Text>
          )}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  mainTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 30,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  
  headerRowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  
  pillOutline: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillTextDark: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  
  pillFilled: {
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillTextWhite: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  
  returnedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  
  horizontalScroll: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },

  // CARDS STYLING
  cardContainer: {
    backgroundColor: '#FFFFFF',
    width: 170,
    borderRadius: 16,
    padding: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: { alignItems: 'center', marginBottom: 10 },
  cardImage: { width: '100%', height: 180, borderRadius: 8 },
  textContainer: { flex: 1, marginBottom: 12 },
  authorText: { fontSize: 10, color: '#888', marginBottom: 2 },
  titleText: { fontSize: 13, fontWeight: 'bold', color: '#111', lineHeight: 18 },
  
  cardBottom: { height: 35, justifyContent: 'center' },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextWhite: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }
});