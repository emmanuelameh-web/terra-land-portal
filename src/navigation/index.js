import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ListingsScreen from '../screens/ListingsScreen';
import LandDetailsScreen from '../screens/LandDetailsScreen';
import PurchaseScreen from '../screens/PurchaseScreen';
import MyPurchasesScreen from '../screens/MyPurchasesScreen';
import PurchaseDetailsScreen from '../screens/PurchaseDetailsScreen';
import MakePaymentScreen from '../screens/MakePaymentScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import BookInspectionScreen from '../screens/BookInspectionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SupportScreen from '../screens/SupportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: theme.bg, primary: theme.primary, card: '#fff', text: theme.text, border: theme.border },
};

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  Explore: ['search', 'search-outline'],
  Purchases: ['briefcase', 'briefcase-outline'],
  Alerts: ['notifications', 'notifications-outline'],
  Profile: ['person', 'person-outline'],
};

function Tabs() {
  const { unreadCount } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        headerTitleStyle: { fontWeight: '800', color: theme.text },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.bg },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Terra Land Portal' }} />
      <Tab.Screen name="Explore" component={ListingsScreen} options={{ title: 'Explore land' }} />
      <Tab.Screen name="Purchases" component={MyPurchasesScreen} options={{ title: 'My purchases' }} />
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{ title: 'Notifications', tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useApp();
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: theme.primary,
          headerTitleStyle: { fontWeight: '700', color: theme.text },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.bg },
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="LandDetails" component={LandDetailsScreen} options={{ title: 'Land details' }} />
            <Stack.Screen name="Purchase" component={PurchaseScreen} options={{ title: 'Buy land' }} />
            <Stack.Screen name="PurchaseDetails" component={PurchaseDetailsScreen} options={{ title: 'Purchase details' }} />
            <Stack.Screen name="MakePayment" component={MakePaymentScreen} options={{ title: 'Make payment' }} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment history' }} />
            <Stack.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Documents' }} />
            <Stack.Screen name="BookInspection" component={BookInspectionScreen} options={{ title: 'Book inspection' }} />
            <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Help & support' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
