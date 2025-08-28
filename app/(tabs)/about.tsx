import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";

export default function AboutScreen() {
  // Tenta obter versão do app.json (fallback para "1.0.0")
  const version =
    // @ts-ignore - compat entre manifests
    Constants?.manifest?.version ??
    // @ts-ignore
    Constants?.manifest2?.extra?.version ??
    "1.0.0";

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.header}>
        <Feather name="check-square" size={48} />
        <Text style={s.title}>App Lista de Tarefas</Text>
        <Text style={s.subtitle}>Exemplo para Aula • v{version}</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Sobre</Text>
        <Text style={s.p}>
          Aplicativo educacional em React Native + Expo demonstrando Atomic Design, navegação com Expo Router e
          persistência com AsyncStorage.
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Repositório</Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Brunoguilhermedemoura/App_Desenvolvimento")}>
          <Text style={s.link}>github.com/Brunoguilhermedemoura/App_Desenvolvimento</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Créditos</Text>
        <Text style={s.p}>Disciplina de Dispositivos Móveis — Unochapecó</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  header: { alignItems: "center", gap: 6, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.7 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  p: { fontSize: 14, lineHeight: 20 },
  link: { color: "#2563eb", fontSize: 14 },
});
