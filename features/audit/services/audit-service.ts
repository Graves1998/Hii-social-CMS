/**
 * Audit Service
 *
 * API service for audit logs
 */

import { api } from '@/services';
import queryString from 'query-string';
import type { LogEntryDto, LogResponseDataDto } from '../dto';
import type { AuditLogDetail, GetAuditLogsPayload, GetAuditLogsResponse } from '../types';
import {
  mapLogEntryToAuditLogDetail,
  mapLogResponseToAuditLogsResponse,
} from '../utils/dto-mappers';

export const auditService = {
  // Get audit logs with filters
  getAuditLogs: async (payload: GetAuditLogsPayload): Promise<GetAuditLogsResponse> => {
    // Map payload to API params

    const searchParams = queryString.stringify(payload);
    const response = await api.get<LogResponseDataDto>(`logs?${searchParams}`);

    // Map DTO to domain type
    return mapLogResponseToAuditLogsResponse(response);
  },

  // Get audit log detail
  getAuditLogDetail: async (logId: string): Promise<AuditLogDetail> => {
    const response = await api.get<LogEntryDto>(`logs/${logId}`);
    return mapLogEntryToAuditLogDetail(response);
  },

  // Export audit logs
  exportAuditLogs: async (
    payload: GetAuditLogsPayload,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> => {
    const searchParams = queryString.stringify({ ...payload, format });
    const response = await api.get(`logs/export?${searchParams}`, {
      // @ts-expect-error - ky supports blob response
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },
};
