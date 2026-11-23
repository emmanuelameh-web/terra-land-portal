import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, Badge, InfoRow, SectionTitle } from '../components/UI';
import { useApp } from '../context/AppContext';
import { PAYMENT_PLANS } from '../data/mock';
import { theme } from '../theme';
import { naira } from '../utils';

export default function LandDetailsScreen({ route, navigation }) {
  const { getListing } = useApp();
  const listing = getListing(route.params.id);

  if (!listing) {
    return (
      <Screen>
        <Text>Listing not found.</Text>
      </Screen>
    );
  }

  const soldOut = listing.plotsAvailable <= 0;

  return (
    <Screen padded={false}>
      <View style={{ height: 190, backgroundColor: listing.color, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="map" size={70} color="rgba(255,255,255,0.85)" />
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: theme.text }}>{listing.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="location-outline" size={15} color={theme.muted} />
              <Text style={{ color: theme.muted }}> {listing.city}, {listing.state}</Text>
            </View>
          </View>
          <Badge label={listing.status} />
        </View>

        <Text style={{ fontSize: 28, fontWeight: '800', color: theme.primary, marginTop: 14 }}>
          {naira(listing.pricePerPlot)}
          <Text style={{ fontSize: 14, color: theme.muted, fontWeight: '500' }}> / plot</Text>
        </Text>

        <Card style={{ marginTop: 14 }}>
          <InfoRow label="Plot size" value={`${listing.sizeSqm} sqm`} />
          <InfoRow label="Plots available" value={String(listing.plotsAvailable)} />
          <InfoRow label="Title" value={listing.titleType} />
          <InfoRow label="Location" value={`${listing.city}, ${listing.state}`} />
        </Card>

        <SectionTitle title="About this land" />
        <Text style={{ color: theme.text, lineHeight: 22 }}>{listing.description}</Text>

        <SectionTitle title="Features" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {listing.features.map((f) => (
            <View
              key={f}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.primarySoft,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Ionicons name="checkmark-circle" size={15} color={theme.primary} />
              <Text style={{ color: theme.primaryDark, marginLeft: 6, fontWeight: '600', fontSize: 13 }}>{f}</Text>
            </View>
          ))}
        </View>

        <SectionTitle title="Payment plans" />
        {PAYMENT_PLANS.map((p) => (
          <View key={p.months} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>{p.label}</Text>
            <Text style={{ color: theme.muted }}>{p.note}</Text>
          </View>
        ))}

        <View style={{ marginTop: 24 }}>
          <Button
            title={soldOut ? 'Sold out' : 'Buy / Reserve plot'}
            icon="cart-outline"
            disabled={soldOut}
            onPress={() => navigation.navigate('Purchase', { id: listing.id })}
          />
          <Button
            title="Book site inspection"
            icon="calendar-outline"
            variant="outline"
            style={{ marginTop: 10 }}
            onPress={() => navigation.navigate('BookInspection', { listingId: listing.id })}
          />
        </View>
      </View>
    </Screen>
  );
}
