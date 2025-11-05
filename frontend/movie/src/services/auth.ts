import { api } from './api';

export const login = async (credentials: { username: string; password: string; }) => {
    const response = await api.post('/token/', credentials);    
    return response;
  
};

export const logout = async () => {
  try {
    await api.post('/logout/');
  } catch (error) {
    console.error("Erro no logout:", error);
  } finally {
    window.location.href = '/login';
  }
};

