import React, { useState } from 'react';
import { showAlert } from '../alert';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, Field, InfoRow } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

const initials = (name) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('');

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, logout, purchases, payments } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [error, setError] = useState('');

  const save = () => {
    if (form.name.trim().length < 2) return setError('Enter your name');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email');
    setError('');
    updateUser({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
    setEditing(false);
  };

  const confirmLogout = () =>
    showAlert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  const Item = ({ icon, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border }}
    >
      <Ionicons name={icon} size={22} color={theme.primary} />
      <Text style={{ flex: 1, marginLeft: 12, color: theme.text, fontWeight: '600' }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={theme.muted} />
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800' }}>{initials(user.name)}</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text, marginTop: 10 }}>{user.name}</Text>
        <Text style={{ color: theme.muted }}>
          {purchases.length} purchase(s) · {payments.length} payment(s)
        </Text>
      </View>

      <Card>
        {editing ? (
          <View>
            <Field label="Full name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} autoCapitalize="words" />
            <Field label="Email" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address" />
            <Field label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" error={error} />
            <View style={{ flexDirection: 'row' }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1, marginRight: 8 }} onPress={() => setEditing(false)} />
              <Button title="Save" style={{ flex: 1, marginLeft: 8 }} onPress={save} />
            </View>
          </View>
        ) : (
          <View>
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <Button title="Edit profile" variant="soft" icon="create-outline" style={{ marginTop: 10 }} onPress={() => setEditing(true)} />
          </View>
        )}
      </Card>

      <Card style={{ paddingVertical: 2 }}>
        <Item icon="receipt-outline" label="Payment history" onPress={() => navigation.navigate('PaymentHistory')} />
        <Item icon="document-text-outline" label="My documents" onPress={() => navigation.navigate('Documents')} />
        <Item icon="calendar-outline" label="Site inspections" onPress={() => navigation.navigate('BookInspection')} />
        <Item icon="help-buoy-outline" label="Help & support" onPress={() => navigation.navigate('Support')} />
      </Card>

      <Button title="Log out" variant="outline" icon="log-out-outline" onPress={confirmLogout} style={{ marginTop: 8 }} />
    </Screen>
  );
}
