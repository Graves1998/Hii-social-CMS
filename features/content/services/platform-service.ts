import { api } from '@/services';
import { GetPlatformsResponse } from '../types';

export const platformService = {
  getPlatforms: async () => {
    const response = await api.get<GetPlatformsResponse>('platform/dashboard/applications');
    return response;
  },
};
