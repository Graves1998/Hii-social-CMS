import { api } from '@/services';
import { PaginationRequest } from '@/lib/types/api';
import queryString from 'query-string';
import { MakeDraftContentPreviewPayload, Video } from '../types';

export const draftContentService = {
  getDraftContent: async (payload: PaginationRequest) => {
    const searchParams = queryString.stringify(payload);
    const response = await api.get('crawler/videos', { searchParams });
    return response;
  },
  getDraftContentDetails: async (video_id: number) => {
    const response = await api.get<Video>(`crawler/videos/${video_id}`);
    return response;
  },
  makeDraftContentPreview: async (video_id: number, payload: MakeDraftContentPreviewPayload) => {
    const response = await api.patch(`crawler/videos/${video_id}/preview`, payload);
    return response;
  },
};
