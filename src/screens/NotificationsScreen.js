import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { formatDate } from '../utils';

export default function NotificationsScreen() {
  const { notifications, markRead, markAllRead, unreadCount } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {unreadCount > 0 && (
        <TouchableOpacity onPress={markAllRead} style={{ padding: 16, paddingBottom: 0, alignItems: 'flex-end' }}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<EmptyState icon="notifications-outline" title="All caught up" body="No notifications yet." />}
        renderItem={({ item }) => (
          <Card
            onPress={() => markRead(item.id)}
            style={{
              flexDirection: 'row',
              borderColor: item.read ? theme.border : theme.primary,
              backgroundColor: item.read ? '#fff' : theme.primarySoft,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={item.icon || 'notifications-outline'} size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: theme.text }}>{item.title}</Text>
              <Text style={{ color: theme.text, marginTop: 2, lineHeight: 20 }}>{item.body}</Text>
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 6 }}>{formatDate(item.date)}</Text>
            </View>
            {!item.read && (
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.primary, marginTop: 4 }} />
            )}
          </Card>
        )}
      />
    </View>
  );
}
