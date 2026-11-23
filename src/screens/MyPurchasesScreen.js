import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Card, Badge, ProgressBar, Chip, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { naira, purchaseStatus, progressOf, balanceOf } from '../utils';

const FILTERS = ['All', 'Active', 'Completed'];

export default function MyPurchasesScreen({ navigation }) {
  const { purchases, getListing } = useApp();
  const [filter, setFilter] = useState('All');

  const data = purchases.filter((p) => {
    const done = p.paid >= p.total;
    if (filter === 'Active') return !done;
    if (filter === 'Completed') return done;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon="home-outline"
            title="No purchases here"
            body="When you reserve a plot it will appear here."
            action="Browse land"
            onAction={() => navigation.navigate('Explore')}
          />
        }
        renderItem={({ item }) => {
          const listing = getListing(item.listingId) || {};
          return (
            <Card onPress={() => navigation.navigate('PurchaseDetails', { id: item.id })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text }}>{listing.title}</Text>
                  <Text style={{ color: theme.muted, marginTop: 2 }}>
                    {item.plots} plot(s) · {listing.city}
                  </Text>
                </View>
                <Badge label={purchaseStatus(item)} />
              </View>
              <View style={{ marginVertical: 12 }}>
                <ProgressBar value={progressOf(item)} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>Paid</Text>
                  <Text style={{ fontWeight: '700', color: theme.success }}>{naira(item.paid)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>Balance</Text>
                  <Text style={{ fontWeight: '700', color: theme.text }}>{naira(balanceOf(item))}</Text>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}
