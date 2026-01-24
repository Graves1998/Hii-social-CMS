import { api } from '@/services';
import { PaginationRequest } from '@/lib/types/api-client';
import queryString from 'query-string';
import { MakeVideoCrawlerPayload } from '../types';

export const crawlService = {
  getContentCrawler: async (payload: PaginationRequest) => {
    const searchParams = queryString.stringify(payload);
    const response = await api.get('crawler/videos', { searchParams });
    return response;
  },
  makeVideoCrawler: async (video_id: string, payload: MakeVideoCrawlerPayload) => {
    const response = await api.patch(`crawler/videos/${video_id}`, payload);
    return response;
  },
};
