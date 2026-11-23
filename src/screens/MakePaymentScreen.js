import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, Field, InfoRow, SectionTitle, Chip } from '../components/UI';
import { useApp } from '../context/AppContext';
import { PAYMENT_METHODS, COMPANY } from '../data/mock';
import { theme } from '../theme';
import { naira, formatDate, nextDue, balanceOf } from '../utils';

export default function MakePaymentScreen({ route, navigation }) {
  const { purchases, getListing, makePayment } = useApp();
  const purchase = purchases.find((p) => p.id === route.params.purchaseId);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('transfer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!purchase) return null;
  const listing = getListing(purchase.listingId) || {};
  const balance = balanceOf(purchase);
  const due = nextDue(purchase);
  const dueAmount = due ? due.amount - due.paid : 0;

  const numeric = Number(String(amount).replace(/[^0-9]/g, ''));

  const pay = () => {
    if (!numeric || numeric < 1000) return setError('Minimum payment is ₦1,000');
    if (numeric > balance) return setError(`Amount cannot exceed your balance of ${naira(balance)}`);
    setError('');
    setLoading(true);
    setTimeout(() => {
      const payment = makePayment(purchase.id, numeric, method);
      setLoading(false);
      setReceipt(payment);
    }, 1200);
  };

  const methodLabel = (id) => (PAYMENT_METHODS.find((m) => m.id === id) || {}).label;

  return (
    <Screen>
      <Card>
        <Text style={{ fontWeight: '800', fontSize: 17, color: theme.text }}>{listing.title}</Text>
        <View style={{ marginTop: 8 }}>
          <InfoRow label="Outstanding balance" value={naira(balance)} bold />
          {due && <InfoRow label={`Next: ${due.label}`} value={`${naira(dueAmount)} · ${formatDate(due.due)}`} />}
        </View>
      </Card>

      <SectionTitle title="Amount" />
      <Field
        value={amount ? naira(numeric) : ''}
        onChangeText={(t) => {
          setAmount(t);
          setError('');
        }}
        placeholder="Enter amount in ₦"
        keyboardType="number-pad"
        icon="cash-outline"
        error={error}
      />
      <View style={{ flexDirection: 'row' }}>
        {dueAmount > 0 && <Chip label={`Next due ${naira(dueAmount)}`} onPress={() => setAmount(String(dueAmount))} />}
        <Chip label="Full balance" onPress={() => setAmount(String(balance))} />
      </View>

      <SectionTitle title="Payment method" />
      {PAYMENT_METHODS.map((m) => {
        const active = m.id === method;
        return (
          <TouchableOpacity
            key={m.id}
            onPress={() => setMethod(m.id)}
            activeOpacity={0.85}
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
            <Ionicons name={m.icon} size={22} color={active ? theme.primary : theme.muted} />
            <Text style={{ flex: 1, marginLeft: 12, fontWeight: '600', color: theme.text }}>{m.label}</Text>
            <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? theme.primary : theme.muted} />
          </TouchableOpacity>
        );
      })}

      {method === 'transfer' && (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentSoft }}>
          <Text style={{ fontWeight: '700', color: theme.text, marginBottom: 6 }}>Transfer to</Text>
          <InfoRow label="Account name" value={COMPANY.bank.name} />
          <InfoRow label="Bank" value={COMPANY.bank.bankName} />
          <InfoRow label="Account number" value={COMPANY.bank.number} bold />
          <Text style={{ color: theme.muted, fontSize: 12, marginTop: 6 }}>
            Demo only. No real payment is made. Tap "Pay" to simulate a successful transfer.
          </Text>
        </Card>
      )}
      {method === 'ussd' && (
        <Card style={{ backgroundColor: theme.accentSoft, borderColor: theme.accentSoft }}>
          <Text style={{ color: theme.text }}>Dial *000*{numeric || 'AMOUNT'}# on your phone to pay. (Demo)</Text>
        </Card>
      )}
      {method === 'card' && (
        <Card>
          <Field label="Card number" placeholder="0000 0000 0000 0000" keyboardType="number-pad" icon="card-outline" />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Field label="Expiry" placeholder="MM/YY" keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Field label="CVV" placeholder="123" keyboardType="number-pad" secureTextEntry />
            </View>
          </View>
        </Card>
      )}

      <Button title={numeric ? `Pay ${naira(numeric)}` : 'Pay'} onPress={pay} loading={loading} style={{ marginTop: 8 }} />

      <Modal visible={!!receipt} transparent animationType="slide" onRequestClose={() => setReceipt(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="checkmark-circle" size={64} color={theme.success} />
              <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text, marginTop: 6 }}>Payment successful</Text>
            </View>
            {receipt && (
              <View>
                <InfoRow label="Amount" value={naira(receipt.amount)} bold />
                <InfoRow label="Property" value={listing.title} />
                <InfoRow label="Method" value={methodLabel(receipt.method)} />
                <InfoRow label="Reference" value={receipt.reference} />
                <InfoRow label="Date" value={formatDate(receipt.date)} />
              </View>
            )}
            <Button
              title="Done"
              style={{ marginTop: 18 }}
              onPress={() => {
                setReceipt(null);
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
