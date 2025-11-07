import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, api_v1 } from '../services/api';

export interface User {
  username: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar token do localStorage ao montar
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      // Adicionar token aos headers de ambos axios clients
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      api_v1.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setUser({ username: 'usuário', id: 0 }); // Placeholder
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;

      // Salvar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Adicionar ao header padrão de ambos axios clients
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      api_v1.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setToken(access);
      setUser({ username, id: 0 });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Credenciais inválidas');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    delete api_v1.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
