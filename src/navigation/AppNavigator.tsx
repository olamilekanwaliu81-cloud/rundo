import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import SenderHomeScreen from '../screens/sender/SenderHomeScreen';
import ErrandFormScreen from '../screens/sender/ErrandFormScreen';
import TrackingScreen from '../screens/sender/TrackingScreen';
import AvailableErrandsScreen from '../screens/runner/AvailableErrandsScreen';
import ActiveErrandScreen from '../screens/runner/ActiveErrandScreen';
import EarningsScreen from '../screens/runner/EarningsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

import { Colors } from '../constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.tabItem}>
      <Text style={[tabStyles.tabIcon, focused && tabStyles.tabIconActive]}>{icon}</Text>
      <Text style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  tabIcon: { fontSize: 22, marginBottom: 2 },
  tabIconActive: {},
  tabLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  tabLabelActive: { color: Colors.primary, fontWeight: '800' },
});

function SenderTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: 70,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tab.Screen
        name="SenderHome"
        component={SenderHomeScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PostErrand"
        component={ErrandFormScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="➕" label="Post" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SenderProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RunnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: 70,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tab.Screen
        name="AvailableErrands"
        component={AvailableErrandsScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="🗺️" label="Errands" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="💰" label="Earnings" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RunnerProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="SenderTabs" component={SenderTabs} />
        <Stack.Screen name="RunnerTabs" component={RunnerTabs} />
        <Stack.Screen name="ErrandForm" component={ErrandFormScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="ActiveErrand" component={ActiveErrandScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
