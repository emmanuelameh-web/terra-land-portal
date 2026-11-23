import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Field } from '../components/UI';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

export default function LoginScreen() {
  const { login } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const e = {};
    if (mode === 'signup' && form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (mode === 'signup' && form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(
        mode === 'signup'
          ? { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() }
          : { email: form.email.trim() }
      );
    }, 700);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Ionicons name="leaf" size={36} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: theme.text }}>Terra Land Portal</Text>
            <Text style={{ color: theme.muted, marginTop: 4, textAlign: 'center' }}>
              Own land with confidence. Track every payment and document in one place.
            </Text>
          </View>

          {mode === 'signup' && (
            <>
              <Field label="Full name" icon="person-outline" value={form.name} onChangeText={set('name')} placeholder="Amina Yusuf" autoCapitalize="words" error={errors.name} />
              <Field label="Phone number" icon="call-outline" value={form.phone} onChangeText={set('phone')} placeholder="08012345678" keyboardType="phone-pad" error={errors.phone} />
            </>
          )}
          <Field label="Email" icon="mail-outline" value={form.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" error={errors.email} />
          <Field label="Password" icon="lock-closed-outline" value={form.password} onChangeText={set('password')} placeholder="At least 6 characters" secureTextEntry error={errors.password} />

          <Button title={mode === 'login' ? 'Log in' : 'Create account'} onPress={submit} loading={loading} style={{ marginTop: 6 }} />

          <TouchableOpacity onPress={() => { setErrors({}); setMode(mode === 'login' ? 'signup' : 'login'); }} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: theme.muted }}>
              {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
              <Text style={{ color: theme.primary, fontWeight: '700' }}>{mode === 'login' ? 'Sign up' : 'Log in'}</Text>
            </Text>
          </TouchableOpacity>
          <Text style={{ color: theme.muted, fontSize: 12, textAlign: 'center', marginTop: 24 }}>
            Demo app: any valid email and a 6+ character password will work.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
