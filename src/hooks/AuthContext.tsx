import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AuthState, LoginData, User } from '../types';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário admin padrão
const DEFAULT_ADMIN_USER: User = {
  id: '1',
  username: 'admin',
  email: 'admin@admin.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Começar como true para evitar navegação prematura
    error: null,
  });

  const login = async (data: LoginData): Promise<boolean> => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar credenciais padrão
      if (data.username === 'admin' && data.password === 'admin') {
        setState({
          user: DEFAULT_ADMIN_USER,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState((prev: AuthState) => ({
          ...prev,
          isLoading: false,
          error: 'Usuário ou senha incorretos',
        }));
        return false;
      }
    } catch (error) {
      setState((prev: AuthState) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao fazer login. Tente novamente.',
      }));
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState((prev: AuthState) => ({ ...prev, error: null }));
  };

  // Simular verificação inicial de autenticação
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, isLoading: false }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
