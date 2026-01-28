import { api } from '@/services';
import queryString from 'query-string';
import { ContentSchema } from '../schemas/content.schema';
import {
  ApproveContentBatchPayload,
  ApproveContentPayload,
  ApprovingStatus,
  GetContentPayload,
  GetContentResponse,
  PublishContentPayload,
  Reel,
  RejectContentBatchPayload,
  ScheduleContentPayload,
} from '../types';

export const contentService = {
  createContent: async (data: ContentSchema) => {
    const { platforms, ...payload } = data;
    const searchParams = queryString.stringify({ api_key: platforms });
    const response = await api.post(`reels/dashboard/?${searchParams}`, payload);
    return response;
  },

  getContent: async (queryParams: Partial<GetContentPayload>) => {
    const searchParams = queryString.stringify(queryParams);
    const response = await api.get<GetContentResponse>(`reels/dashboard?${searchParams}`);
    return response;
  },

  getContentDetails: async (id: string, approving_status: string) => {
    const response = await api.get<Reel>(
      `reels/dashboard/${id}?approving_status=${approving_status}`
    );
    return response;
  },

  getApprovingStatus: async () => {
    const response = await api.get<ApprovingStatus[]>(`reels/dashboard/approving-status`);
    return response;
  },

  // Schedule Content

  scheduleContent: async (payload: ScheduleContentPayload) => {
    const response = await api.post(`reels/dashboard/schedules`, payload);
    return response;
  },

  // Approve Content

  approveContent: async (payload: ApproveContentPayload) => {
    const response = await api.post(`reels/dashboard/approve`, payload);
    return response;
  },

  approveContents: async (payload: ApproveContentBatchPayload) => {
    const response = await api.post(`reels/dashboard/approve-batch`, payload);
    return response;
  },

  // Publish Content

  publishContent: async (payload: PublishContentPayload) => {
    const response = await api.post(`reels/dashboard/publish-batch`, payload);
    return response;
  },

  // Reject Content

  rejectContent: async (payload: ApproveContentPayload) => {
    const response = await api.post(`reels/dashboard/reject`, payload);
    return response;
  },

  rejectContents: async (payload: RejectContentBatchPayload) => {
    const response = await api.post(`reels/dashboard/reject-batch`, payload);
    return response;
  },
};
