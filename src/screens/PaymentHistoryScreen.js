import React, { useState } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, InfoRow, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';
import { PAYMENT_METHODS } from '../data/mock';
import { theme } from '../theme';
import { naira, formatDate } from '../utils';

export default function PaymentHistoryScreen({ route }) {
  const { payments, purchases, getListing } = useApp();
  const purchaseId = route.params && route.params.purchaseId;
  const [selected, setSelected] = useState(null);

  const data = purchaseId ? payments.filter((p) => p.purchaseId === purchaseId) : payments;
  const total = data.reduce((s, p) => s + p.amount, 0);

  const titleFor = (p) => {
    const pur = purchases.find((x) => x.id === p.purchaseId);
    const l = pur ? getListing(pur.listingId) : null;
    return l ? l.title : 'Payment';
  };
  const methodLabel = (id) => (PAYMENT_METHODS.find((m) => m.id === id) || {}).label;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          data.length ? (
            <Card style={{ backgroundColor: theme.primarySoft, borderColor: theme.primarySoft }}>
              <Text style={{ color: theme.muted }}>Total paid</Text>
              <Text style={{ fontSize: 26, fontWeight: '800', color: theme.primaryDark }}>{naira(total)}</Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>{data.length} transaction(s)</Text>
            </Card>
          ) : null
        }
        ListEmptyComponent={<EmptyState icon="receipt-outline" title="No payments yet" body="Receipts will appear here after you pay." />}
        renderItem={({ item }) => (
          <Card onPress={() => setSelected(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: theme.successSoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="checkmark" size={20} color={theme.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: theme.text }}>{titleFor(item)}</Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>
                {formatDate(item.date)} · {methodLabel(item.method)}
              </Text>
            </View>
            <Text style={{ fontWeight: '800', color: theme.text }}>{naira(item.amount)}</Text>
          </Card>
        )}
      />

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 22 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: 10 }}>Receipt</Text>
            {selected && (
              <View>
                <InfoRow label="Property" value={titleFor(selected)} />
                <InfoRow label="Amount" value={naira(selected.amount)} bold />
                <InfoRow label="Method" value={methodLabel(selected.method)} />
                <InfoRow label="Reference" value={selected.reference} />
                <InfoRow label="Date" value={formatDate(selected.date)} />
              </View>
            )}
            <Button title="Close" style={{ marginTop: 16 }} onPress={() => setSelected(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
