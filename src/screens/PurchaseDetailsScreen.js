import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, ProgressBar, Button, InfoRow, SectionTitle } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { naira, formatDate, purchaseStatus, progressOf, balanceOf, daysUntil } from '../utils';

const scheduleStatus = (s) => {
  if (s.paid >= s.amount) return 'Paid';
  if (s.paid > 0) return 'Partial';
  if (daysUntil(s.due) < 0) return 'Due';
  return 'Pending';
};

export default function PurchaseDetailsScreen({ route, navigation }) {
  const { purchases, getListing } = useApp();
  const purchase = purchases.find((p) => p.id === route.params.id);
  if (!purchase) return null;
  const listing = getListing(purchase.listingId) || {};
  const done = purchase.paid >= purchase.total;

  return (
    <Screen>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text }}>{listing.title}</Text>
            <Text style={{ color: theme.muted, marginTop: 2 }}>
              {listing.city}, {listing.state}
            </Text>
          </View>
          <Badge label={purchaseStatus(purchase)} />
        </View>
        <View style={{ marginVertical: 14 }}>
          <ProgressBar value={progressOf(purchase)} height={10} />
          <Text style={{ color: theme.muted, marginTop: 6, fontSize: 12 }}>
            {Math.round(progressOf(purchase) * 100)}% paid
          </Text>
        </View>
        <InfoRow label="Plots" value={String(purchase.plots)} />
        <InfoRow label="Total price" value={naira(purchase.total)} bold />
        <InfoRow label="Amount paid" value={naira(purchase.paid)} />
        <InfoRow label="Balance" value={naira(balanceOf(purchase))} bold />
        <InfoRow label="Plan" value={purchase.planMonths === 0 ? 'Outright' : `${purchase.planMonths}-month installments`} />
        <InfoRow label="Started" value={formatDate(purchase.createdAt)} />
      </Card>

      <View style={{ marginTop: 4 }}>
        {!done && (
          <Button
            title="Make payment"
            icon="cash-outline"
            onPress={() => navigation.navigate('MakePayment', { purchaseId: purchase.id })}
          />
        )}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button
            title="Documents"
            variant="soft"
            icon="document-text-outline"
            style={{ flex: 1, marginRight: 8 }}
            onPress={() => navigation.navigate('Documents', { purchaseId: purchase.id })}
          />
          <Button
            title="History"
            variant="soft"
            icon="receipt-outline"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate('PaymentHistory', { purchaseId: purchase.id })}
          />
        </View>
      </View>

      <SectionTitle title="Payment schedule" />
      {purchase.schedule.map((s) => {
        const status = scheduleStatus(s);
        return (
          <Card key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={status === 'Paid' ? 'checkmark-circle' : status === 'Due' ? 'alert-circle' : 'ellipse-outline'}
              size={24}
              color={status === 'Paid' ? theme.success : status === 'Due' ? theme.danger : theme.muted}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '600', color: theme.text }}>{s.label}</Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>Due {formatDate(s.due)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: '700', color: theme.text }}>{naira(s.amount)}</Text>
              <View style={{ marginTop: 4 }}>
                <Badge label={status} />
              </View>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
