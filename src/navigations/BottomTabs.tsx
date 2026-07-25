import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// تعريف نوع الـ Tabs
type RootTabParamList = {
  الرئيسية: undefined;
  الطلبات: undefined;
  الحالة: undefined;
  الإعدادات: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// الشاشات الأساسية
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>الرئيسية</Text>
    </View>
  );
}

function OrdersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>الطلبات</Text>
    </View>
  );
}

function StatusScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>الحالة</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>الإعدادات</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'الرئيسية') {
              iconName = 'home';
            } else if (route.name === 'الطلبات') {
              iconName = 'list';
            } else if (route.name === 'الحالة') {
              iconName = 'time';
            } else {
              iconName = 'settings';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="الرئيسية" component={HomeScreen} />
        <Tab.Screen name="الطلبات" component={OrdersScreen} />
        <Tab.Screen name="الحالة" component={StatusScreen} />
        <Tab.Screen name="الإعدادات" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
