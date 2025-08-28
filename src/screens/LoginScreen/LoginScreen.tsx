import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/src/atoms/Button';
import { Input } from '@/src/atoms/Input';
import { useAuth } from '@/src/hooks/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      Alert.alert('Erro de Login', error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login({ username: username.trim(), password });
      if (success) {
        router.replace('/(tabs)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setUsername('admin');
    setPassword('admin');
    
    setIsSubmitting(true);
    try {
      const success = await login({ username: 'admin', password: 'admin' });
      if (success) {
        router.replace('/(tabs)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Bem-vindo</ThemedText>
            <ThemedText style={styles.subtitle}>
              Faça login para acessar sua conta
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Usuário"
              placeholder="Digite seu usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Button
              title={isSubmitting ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              disabled={isSubmitting || isLoading}
              fullWidth
              style={styles.loginButton}
            />

            {/*<Button
              title="Login Demo (admin/admin)"
              variant="secondary"
              onPress={handleDemoLogin}
              disabled={isSubmitting || isLoading}
              fullWidth
              style={styles.demoButton}
            />*/} 
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Credenciais padrão: admin / admin
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  loginButton: {
    marginTop: 16,
  },
  demoButton: {
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
