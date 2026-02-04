import { api } from '@/services';

class SystemService {
  private baseUrl = 'system';

  async getPermissions() {
    const data = await api.get(`${this.baseUrl}/permissions`);
    return data;
  }
}

export const systemService = new SystemService();
