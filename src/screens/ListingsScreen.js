import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chip, EmptyState } from '../components/UI';
import ListingCard from '../components/ListingCard';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

const STATUSES = ['All', 'Available', 'Selling Fast', 'Sold Out'];

export default function ListingsScreen({ navigation }) {
  const { listings } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [city, setCity] = useState('All');
  const [sort, setSort] = useState('none'); // none | asc | desc

  const cities = useMemo(() => ['All', ...Array.from(new Set(listings.map((l) => l.city)))], [listings]);

  const data = useMemo(() => {
    let out = listings.filter((l) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || `${l.title} ${l.city} ${l.state}`.toLowerCase().includes(q);
      const matchS = status === 'All' || l.status === status;
      const matchC = city === 'All' || l.city === city;
      return matchQ && matchS && matchC;
    });
    if (sort === 'asc') out = [...out].sort((a, b) => a.pricePerPlot - b.pricePerPlot);
    if (sort === 'desc') out = [...out].sort((a, b) => b.pricePerPlot - a.pricePerPlot);
    return out;
  }, [listings, query, status, city, sort]);

  const cycleSort = () => setSort((s) => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'));

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: 16, paddingBottom: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="search" size={18} color={theme.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or location"
            placeholderTextColor="#9AA5A0"
            style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 16, color: theme.text }}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {STATUSES.map((s) => (
            <Chip key={s} label={s} active={status === s} onPress={() => setStatus(s)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {cities.map((c) => (
            <Chip key={c} label={c} active={city === c} onPress={() => setCity(c)} />
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: theme.muted }}>{data.length} listing(s)</Text>
          <TouchableOpacity onPress={cycleSort} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-vertical" size={16} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: '600', marginLeft: 4 }}>
              {sort === 'none' ? 'Sort by price' : sort === 'asc' ? 'Price: low to high' : 'Price: high to low'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => navigation.navigate('LandDetails', { id: item.id })} />
        )}
        ListEmptyComponent={<EmptyState icon="search-outline" title="No land found" body="Try changing your search or filters." />}
      />
    </View>
  );
}
