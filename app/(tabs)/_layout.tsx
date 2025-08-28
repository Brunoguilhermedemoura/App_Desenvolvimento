import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Minhas Tarefas',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 30 : 26} 
                name={focused ? "checklist" : "list.bullet"} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Nova Tarefa',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 32 : 28} 
                name={focused ? "plus.circle.fill" : "plus.circle"} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
