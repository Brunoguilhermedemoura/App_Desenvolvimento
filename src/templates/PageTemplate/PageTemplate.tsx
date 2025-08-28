import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/src/hooks/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  showLogout?: boolean;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  subtitle,
  children,
  scrollable = false,
  keyboardAvoiding = false,
  showLogout = false,
}) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Usar setTimeout para garantir que o router esteja pronto
    setTimeout(() => {
      router.replace('/login' as any);
    }, 100);
  };

  const content = (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{title}</ThemedText>
            {subtitle && (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            )}
          </ThemedView>
          {showLogout && (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <ThemedText style={styles.logoutText}>Sair</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        {children}
      </ThemedView>
    </ThemedView>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollable ? (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    );
  }

  return scrollable ? (
    <ScrollView 
      style={styles.scrollView} 
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espaço extra para evitar sobreposição com tabs
  },
});
