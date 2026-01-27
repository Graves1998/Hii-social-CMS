import { api } from '@/services';
import { RegisterFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types';

const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post<LoginResponse>('users/login', { username, password });
    return response;
  },
  logout: async () => {
    const response = await api.post('users/logout');
    return response;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('users/tokens/refresh', { refreshToken });
    return response;
  },
  getCurrentUser: async () => {
    const response = await api.get('users/me/profile');
    return response;
  },
  register: async (payload: Omit<RegisterFormData, 'confirmPassword'>) => {
    const response = await api.post<LoginResponse>('users/register', payload);
    return response;
  },
};

export default authService;
