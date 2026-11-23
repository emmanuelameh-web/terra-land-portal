import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from './UI';
import { naira } from '../utils';

export default function ListingCard({ listing, onPress, compact }) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={[styles.card, compact && { width: 250, marginRight: 12 }]}>
      <View style={[styles.hero, { backgroundColor: listing.color }]}>
        <Ionicons name="map-outline" size={44} color="rgba(255,255,255,0.85)" />
        <View style={styles.badgeWrap}>
          <Badge label={listing.status} />
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={theme.muted} />
          <Text style={styles.sub}> {listing.city}, {listing.state}</Text>
        </View>
        <View style={[styles.row, { justifyContent: 'space-between', marginTop: 10 }]}>
          <Text style={styles.price}>{naira(listing.pricePerPlot)}</Text>
          <Text style={styles.sub}>{listing.sizeSqm} sqm / plot</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  hero: { height: 110, alignItems: 'center', justifyContent: 'center' },
  badgeWrap: { position: 'absolute', top: 10, left: 10 },
  title: { fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  sub: { color: theme.muted, fontSize: 13 },
  price: { color: theme.primary, fontSize: 17, fontWeight: '800' },
});
