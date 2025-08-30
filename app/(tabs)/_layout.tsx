import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
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
  );
}

// === Substitua por este FancyTabBar ===
function FancyTabBar({ state, descriptors, navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabbar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const iconName =
            route.name === "index" ? "check-square" :
            route.name === "explore" ? "plus" :
            "info";

          const label =
            route.name === "index" ? "Tarefas" :
            route.name === "explore" ? "Adicionar" :
            "Sobre";

          // Botão central destacado (FAB) continua, mas a barra está FIXA no rodapé
          if (route.name === "explore") {
            return (
              <TouchableOpacity key={route.key} onPress={onPress} style={styles.fab} activeOpacity={0.9}>
                <Feather name={iconName as any} size={28} color="#fff" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.8}>
              <Feather name={iconName as any} size={22} color={isFocused ? "#fff" : "#9ca3af"} />
              <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// === Estilos para barra fixa embaixo ===
const styles = StyleSheet.create({
  // Agora a barra é dockada no rodapé — sem position absolute.
  container: {
    backgroundColor: "#111827", // cinza-900
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingBottom: Platform.select({ ios: 8, android: 0 }), // “safe area” básico
  },
  tabbar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  label: { color: "#9ca3af", fontSize: 12, fontWeight: "600" },
  labelActive: { color: "#fff" },

  // FAB central continua levemente sobreposto, mas a barra está fixa no rodapé
  fab: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -28 }, { translateY: -20 }],
    bottom: 12,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowColor: "#2563eb",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
});