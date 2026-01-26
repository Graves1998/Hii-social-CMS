import { api } from '@/services/apiService';
import { GetCategoriesResponse } from '../types';

export const categoryService = {
  getCategories: async () => {
    const response = await api.get<GetCategoriesResponse>('categories/dashboard');
    return response;
  },
};
