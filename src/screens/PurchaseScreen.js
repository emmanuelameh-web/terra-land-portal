import React, { useState } from 'react';
import { showAlert } from '../alert';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, InfoRow, SectionTitle, Stepper } from '../components/UI';
import { useApp } from '../context/AppContext';
import { PAYMENT_PLANS } from '../data/mock';
import { theme } from '../theme';
import { naira } from '../utils';

export default function PurchaseScreen({ route, navigation }) {
  const { getListing, createPurchase } = useApp();
  const listing = getListing(route.params.id);
  const [plots, setPlots] = useState(1);
  const [planMonths, setPlanMonths] = useState(0);
  const [agree, setAgree] = useState(false);

  if (!listing) return null;

  const total = listing.pricePerPlot * plots;
  const deposit = planMonths === 0 ? total : Math.round(total * 0.3);
  const each = planMonths === 0 ? 0 : Math.floor((total - deposit) / planMonths);

  const confirm = () => {
    const purchase = createPurchase(listing, plots, planMonths);
    showAlert(
      'Plot reserved',
      'Your plot has been reserved. Make your first payment to secure it.',
      [
        { text: 'Later', onPress: () => navigation.replace('PurchaseDetails', { id: purchase.id }) },
        {
          text: 'Pay now',
          onPress: () => {
            navigation.replace('PurchaseDetails', { id: purchase.id });
            navigation.navigate('MakePayment', { purchaseId: purchase.id });
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>{listing.title}</Text>
        <Text style={{ color: theme.muted, marginTop: 2 }}>
          {listing.city}, {listing.state} · {listing.sizeSqm} sqm per plot
        </Text>
      </Card>

      <SectionTitle title="Number of plots" />
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: theme.muted }}>{listing.plotsAvailable} available</Text>
          <Text style={{ color: theme.text, fontWeight: '700' }}>{naira(listing.pricePerPlot)} each</Text>
        </View>
        <Stepper value={plots} onChange={setPlots} min={1} max={Math.min(10, listing.plotsAvailable)} />
      </Card>

      <SectionTitle title="Payment plan" />
      {PAYMENT_PLANS.map((p) => {
        const active = p.months === planMonths;
        return (
          <TouchableOpacity
            key={p.months}
            activeOpacity={0.85}
            onPress={() => setPlanMonths(p.months)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: active ? theme.primarySoft : '#fff',
              borderWidth: 1.5,
              borderColor: active ? theme.primary : theme.border,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Ionicons
              name={active ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={active ? theme.primary : theme.muted}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontWeight: '700', color: theme.text }}>{p.label}</Text>
              <Text style={{ color: theme.muted, fontSize: 13 }}>{p.note}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <SectionTitle title="Summary" />
      <Card>
        <InfoRow label="Plots" value={String(plots)} />
        <InfoRow label="Total price" value={naira(total)} bold />
        <InfoRow label={planMonths === 0 ? 'Pay today' : 'Initial deposit (30%)'} value={naira(deposit)} />
        {planMonths > 0 && <InfoRow label={`${planMonths} monthly installments of`} value={naira(each)} />}
      </Card>

      <TouchableOpacity
        onPress={() => setAgree(!agree)}
        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}
      >
        <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={24} color={agree ? theme.primary : theme.muted} />
        <Text style={{ marginLeft: 10, color: theme.text, flex: 1 }}>
          I have read and agree to the terms of sale and payment schedule.
        </Text>
      </TouchableOpacity>

      <Button title="Confirm reservation" disabled={!agree} onPress={confirm} />
    </Screen>
  );
}
