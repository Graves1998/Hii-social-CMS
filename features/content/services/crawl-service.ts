import { api } from '@/services';
import { PaginationRequest } from '@/lib/types/api';
import queryString from 'query-string';
import { MakeVideoCrawlerPayload, Video } from '../types';

export const crawlService = {
  getContentCrawler: async (payload: PaginationRequest) => {
    const searchParams = queryString.stringify(payload);
    const response = await api.get('crawler/videos', { searchParams });
    return response;
  },
  getContentCrawlerDetails: async (video_id: number) => {
    const response = await api.get<Video>(`crawler/videos/${video_id}`);
    return response;
  },
  makeVideoCrawler: async (video_id: number, payload: MakeVideoCrawlerPayload) => {
    const response = await api.patch(`crawler/videos/${video_id}/preview`, payload);
    return response;
  },
};
