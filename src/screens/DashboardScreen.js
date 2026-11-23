import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, ProgressBar, SectionTitle, Badge, EmptyState } from '../components/UI';
import ListingCard from '../components/ListingCard';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { naira, formatDate, daysUntil, nextDue, balanceOf } from '../utils';

const ACTIONS = [
  { label: 'Browse land', icon: 'search-outline', go: ['Explore'] },
  { label: 'Pay now', icon: 'cash-outline', go: ['Purchases'] },
  { label: 'Inspect', icon: 'calendar-outline', go: ['BookInspection'] },
  { label: 'Documents', icon: 'document-text-outline', go: ['Documents'] },
];

export default function DashboardScreen({ navigation }) {
  const { user, purchases, payments, listings, getListing } = useApp();

  const totalValue = purchases.reduce((s, p) => s + p.total, 0);
  const totalPaid = purchases.reduce((s, p) => s + p.paid, 0);
  const balance = totalValue - totalPaid;

  // earliest unpaid schedule item across all purchases
  const upcoming = purchases
    .filter((p) => balanceOf(p) > 0)
    .map((p) => ({ purchase: p, item: nextDue(p) }))
    .filter((x) => x.item)
    .sort((a, b) => new Date(a.item.due) - new Date(b.item.due))[0];

  const goTo = (target) => {
    if (target[0] === 'Explore' || target[0] === 'Purchases') navigation.navigate('Tabs', { screen: target[0] });
    else navigation.navigate(target[0]);
  };

  const firstName = (user && user.name ? user.name.split(' ')[0] : 'there');

  return (
    <Screen>
      <Text style={{ color: theme.muted }}>Welcome back,</Text>
      <Text style={{ fontSize: 26, fontWeight: '800', color: theme.text, marginBottom: 16 }}>{firstName}</Text>

      <View style={{ backgroundColor: theme.primary, borderRadius: 18, padding: 20 }}>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Total land investment</Text>
        <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', marginVertical: 4 }}>{naira(totalValue)}</Text>
        <View style={{ marginVertical: 10 }}>
          <ProgressBar value={totalValue ? totalPaid / totalValue : 0} height={8} color="#fff" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Paid</Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{naira(totalPaid)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Balance</Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{naira(balance)}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        {ACTIONS.map((a) => (
          <TouchableOpacity key={a.label} style={{ alignItems: 'center', width: '23%' }} onPress={() => goTo(a.go)}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundColor: theme.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
              }}
            >
              <Ionicons name={a.icon} size={24} color={theme.primary} />
            </View>
            <Text style={{ fontSize: 12, color: theme.text, fontWeight: '600' }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="Next payment" />
      {upcoming ? (
        <Card onPress={() => navigation.navigate('MakePayment', { purchaseId: upcoming.purchase.id })}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: theme.text, fontSize: 16 }}>
                {(getListing(upcoming.purchase.listingId) || {}).title}
              </Text>
              <Text style={{ color: theme.muted, marginTop: 2 }}>{upcoming.item.label}</Text>
            </View>
            <Text style={{ fontWeight: '800', fontSize: 18, color: theme.primary }}>
              {naira(upcoming.item.amount - upcoming.item.paid)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Ionicons name="time-outline" size={16} color={theme.muted} />
            <Text style={{ color: theme.muted, marginLeft: 6, flex: 1 }}>
              Due {formatDate(upcoming.item.due)}
            </Text>
            <Badge label={daysUntil(upcoming.item.due) < 0 ? 'Due' : `${daysUntil(upcoming.item.due)} days`} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={{ color: theme.muted }}>You have no pending payments. 🎉</Text>
        </Card>
      )}

      <SectionTitle title="Featured land" action="See all" onAction={() => navigation.navigate('Tabs', { screen: 'Explore' })} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {listings
          .filter((l) => l.status !== 'Sold Out')
          .slice(0, 4)
          .map((l) => (
            <ListingCard key={l.id} listing={l} compact onPress={() => navigation.navigate('LandDetails', { id: l.id })} />
          ))}
      </ScrollView>

      <SectionTitle title="Recent payments" action="History" onAction={() => navigation.navigate('PaymentHistory')} />
      {payments.length === 0 ? (
        <EmptyState icon="receipt-outline" title="No payments yet" body="Your payments will show up here." />
      ) : (
        payments.slice(0, 3).map((p) => {
          const pur = purchases.find((x) => x.id === p.purchaseId);
          const l = pur ? getListing(pur.listingId) : null;
          return (
            <Card key={p.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.successSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="arrow-down" size={18} color={theme.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: theme.text }}>{l ? l.title : 'Payment'}</Text>
                <Text style={{ color: theme.muted, fontSize: 12 }}>{formatDate(p.date)} · {p.reference}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: theme.text }}>{naira(p.amount)}</Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}
