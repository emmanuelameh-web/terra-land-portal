import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation';
import { theme } from './src/theme';

export default function App() {
  const content = (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );

  // On the web, show the app as a centered phone-width column instead of stretching across the screen.
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#E9E7E0', alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: 480,
            backgroundColor: theme.bg,
            boxShadow: '0 0 30px rgba(0,0,0,0.12)',
          }}
        >
          {content}
        </View>
      </View>
    );
  }

  return content;
}
