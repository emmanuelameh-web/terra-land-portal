import React, { useState } from 'react';
import { showAlert } from '../alert';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, SectionTitle } from '../components/UI';
import { COMPANY, FAQS } from '../data/mock';
import { theme } from '../theme';

const open = (url) =>
  Linking.openURL(url).catch(() => showAlert('Unable to open', 'This action is not available on your device.'));

export default function SupportScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  const actions = [
    { label: 'Call us', icon: 'call', onPress: () => open(`tel:${COMPANY.phone}`) },
    { label: 'WhatsApp', icon: 'logo-whatsapp', onPress: () => open(`https://wa.me/${COMPANY.whatsapp}`) },
    { label: 'Email', icon: 'mail', onPress: () => open(`mailto:${COMPANY.email}`) },
  ];

  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text }}>{COMPANY.name}</Text>
        <Text style={{ color: theme.muted, marginTop: 4 }}>{COMPANY.address}</Text>
        <Text style={{ color: theme.muted, marginTop: 2 }}>{COMPANY.hours}</Text>
      </Card>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {actions.map((a) => (
          <TouchableOpacity
            key={a.label}
            onPress={a.onPress}
            style={{
              width: '31%',
              backgroundColor: theme.primarySoft,
              borderRadius: 14,
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <Ionicons name={a.icon} size={24} color={theme.primary} />
            <Text style={{ color: theme.primaryDark, fontWeight: '700', marginTop: 6 }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="Frequently asked questions" />
      {FAQS.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <Card key={f.q} onPress={() => setOpenIndex(isOpen ? null : i)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontWeight: '700', color: theme.text }}>{f.q}</Text>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={theme.muted} />
            </View>
            {isOpen && <Text style={{ color: theme.text, marginTop: 10, lineHeight: 21 }}>{f.a}</Text>}
          </Card>
        );
      })}
    </Screen>
  );
}
