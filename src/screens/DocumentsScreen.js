import React from 'react';
import { showAlert } from '../alert';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, SectionTitle, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { getDocuments } from '../utils';

export default function DocumentsScreen({ route, navigation }) {
  const { purchases, getListing } = useApp();
  const purchaseId = route.params && route.params.purchaseId;
  const list = purchaseId ? purchases.filter((p) => p.id === purchaseId) : purchases;

  if (!list.length) {
    return (
      <Screen>
        <EmptyState
          icon="document-text-outline"
          title="No documents yet"
          body="Documents appear once you reserve a plot."
          action="Browse land"
          onAction={() => navigation.navigate('Tabs', { screen: 'Explore' })}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      {list.map((p) => {
        const listing = getListing(p.listingId) || {};
        return (
          <View key={p.id}>
            <SectionTitle title={listing.title || 'Property'} />
            {getDocuments(p).map((d) => (
              <Card key={d.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: d.unlocked ? theme.primarySoft : theme.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name={d.unlocked ? 'document-text' : 'lock-closed'}
                    size={22}
                    color={d.unlocked ? theme.primary : theme.muted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: theme.text }}>{d.name}</Text>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>
                    {d.unlocked ? 'Ready to download' : d.rule}
                  </Text>
                </View>
                {d.unlocked && (
                  <Button
                    title="Get"
                    variant="soft"
                    style={{ minHeight: 38, paddingHorizontal: 14 }}
                    onPress={() => showAlert('Download started', `${d.name} (demo file) would be saved to your device.`)}
                  />
                )}
              </Card>
            ))}
          </View>
        );
      })}
    </Screen>
  );
}
