import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export function Screen({ children, scroll = true, padded = true, style, contentStyle }) {
  if (!scroll) {
    return <View style={[styles.screen, padded && styles.padded, style]}>{children}</View>;
  }
  return (
    <ScrollView
      style={[styles.screen, style]}
      contentContainerStyle={[padded && styles.padded, { paddingBottom: 40 }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, onPress }) {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp activeOpacity={0.85} onPress={onPress} style={[styles.card, style]}>
      {children}
    </Comp>
  );
}

export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, style }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const bg = isPrimary ? theme.primary : isOutline ? 'transparent' : theme.primarySoft;
  const color = isPrimary ? '#fff' : theme.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bg, borderColor: theme.primary, borderWidth: isOutline ? 1.5 : 0 },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={color} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.buttonText, { color }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const BADGE_COLORS = {
  Available: [theme.successSoft, theme.success],
  'Selling Fast': [theme.warnSoft, theme.warn],
  'Sold Out': [theme.dangerSoft, theme.danger],
  Reserved: [theme.infoSoft, theme.info],
  Paying: [theme.warnSoft, theme.warn],
  'Fully Paid': [theme.successSoft, theme.success],
  Scheduled: [theme.infoSoft, theme.info],
  Cancelled: [theme.dangerSoft, theme.danger],
  Paid: [theme.successSoft, theme.success],
  Pending: [theme.border, theme.muted],
  Partial: [theme.warnSoft, theme.warn],
  Due: [theme.dangerSoft, theme.danger],
};

export function Badge({ label }) {
  const [bg, fg] = BADGE_COLORS[label] || [theme.border, theme.muted];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, height = 8, color = theme.primary }) {
  return (
    <View style={[styles.progressTrack, { height }]}>
      <View style={{ width: `${Math.round(value * 100)}%`, height, backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

export function Field({ label, error, icon, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, error && { borderColor: theme.danger }]}>
        {icon ? <Ionicons name={icon} size={18} color={theme.muted} style={{ marginRight: 8 }} /> : null}
        <TextInput
          placeholderTextColor="#9AA5A0"
          style={styles.input}
          autoCapitalize="none"
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.chip, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
    >
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function EmptyState({ icon = 'file-tray-outline', title, body, action, onAction }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={46} color={theme.border} />
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>{title}</Text>
      {body ? <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 4 }}>{body}</Text> : null}
      {action ? <Button title={action} onPress={onAction} style={{ marginTop: 16, paddingHorizontal: 24 }} /> : null}
    </View>
  );
}

export function InfoRow({ label, value, bold }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', paddingVertical: 6 }]}>
      <Text style={{ color: theme.muted }}>{label}</Text>
      <Text style={{ color: theme.text, fontWeight: bold ? '700' : '500', flexShrink: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

export function Stepper({ value, onChange, min = 1, max = 10 }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={20} color={theme.primary} />
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Ionicons name="add" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  padded: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  button: {
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  progressTrack: { backgroundColor: theme.border, borderRadius: 8, overflow: 'hidden' },
  label: { fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  input: { flex: 1, fontSize: 16, color: theme.text, paddingVertical: 10 },
  error: { color: theme.danger, fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.text },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  chipText: { color: theme.text, fontWeight: '600', fontSize: 13 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { fontSize: 20, fontWeight: '700', minWidth: 48, textAlign: 'center', color: theme.text },
});
