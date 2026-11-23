import React, { useMemo, useState } from 'react';
import { showAlert } from '../alert';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Button, Chip, SectionTitle, Stepper, Badge } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { addDays } from '../utils';

const SLOTS = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BookInspectionScreen({ route }) {
  const { listings, inspections, bookInspection, cancelInspection, getListing } = useApp();
  const preset = route.params && route.params.listingId;
  const available = listings.filter((l) => l.status !== 'Sold Out');
  const [listingId, setListingId] = useState(preset || (available[0] && available[0].id));
  const [dayIndex, setDayIndex] = useState(1);
  const [time, setTime] = useState(SLOTS[0]);
  const [guests, setGuests] = useState(1);

  const days = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const d = addDays(i + 1);
        return { i, d, label: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`, sun: d.getDay() === 0 };
      }).filter((x) => !x.sun),
    []
  );
  const selectedDay = days.find((x) => x.i === dayIndex) || days[0];

  const submit = () => {
    bookInspection({ listingId, dateLabel: selectedDay.label, time, guests });
    showAlert('Inspection booked', `${selectedDay.label} at ${time}. We will confirm by call or WhatsApp.`);
  };

  const mine = inspections;

  return (
    <Screen>
      <SectionTitle title="Which land?" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {available.map((l) => (
          <Chip key={l.id} label={l.title} active={listingId === l.id} onPress={() => setListingId(l.id)} />
        ))}
      </ScrollView>

      <SectionTitle title="Pick a date" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((x) => (
          <Chip key={x.i} label={x.label} active={selectedDay.i === x.i} onPress={() => setDayIndex(x.i)} />
        ))}
      </ScrollView>

      <SectionTitle title="Pick a time" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {SLOTS.map((s) => (
          <View key={s} style={{ marginBottom: 8 }}>
            <Chip label={s} active={time === s} onPress={() => setTime(s)} />
          </View>
        ))}
      </View>

      <SectionTitle title="Number of guests" />
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: theme.text, fontWeight: '600' }}>People visiting</Text>
        <Stepper value={guests} onChange={setGuests} min={1} max={6} />
      </Card>

      <Button title="Book inspection" icon="calendar-outline" onPress={submit} style={{ marginTop: 6 }} />

      {mine.length > 0 && (
        <View>
          <SectionTitle title="Your inspections" />
          {mine.map((i) => {
            const l = getListing(i.listingId) || {};
            return (
              <Card key={i.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontWeight: '700', color: theme.text }}>{l.title}</Text>
                    <Text style={{ color: theme.muted, marginTop: 2 }}>
                      {i.dateLabel} · {i.time} · {i.guests} guest(s)
                    </Text>
                  </View>
                  <Badge label={i.status} />
                </View>
                {i.status === 'Scheduled' && (
                  <TouchableOpacity onPress={() => cancelInspection(i.id)} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="close-circle-outline" size={16} color={theme.danger} />
                    <Text style={{ color: theme.danger, marginLeft: 4, fontWeight: '600' }}>Cancel booking</Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
