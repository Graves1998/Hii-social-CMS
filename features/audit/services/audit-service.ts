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

class AuditService {
  private baseUrl = 'logs';

  async getAuditLogs(payload: GetAuditLogsPayload): Promise<GetAuditLogsResponse> {
    const searchParams = queryString.stringify(payload);
    const data = await api.get<LogResponseDataDto>(`${this.baseUrl}?${searchParams}`);

    return mapLogResponseToAuditLogsResponse(data);
  }

  async getAuditLogDetail(logId: string): Promise<AuditLogDetail> {
    const data = await api.get<LogEntryDto>(`${this.baseUrl}/${logId}`);
    return mapLogEntryToAuditLogDetail(data);
  }

  async exportAuditLogs(
    payload: GetAuditLogsPayload,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> {
    const searchParams = queryString.stringify({ ...payload, format });
    const data = await api.get(`${this.baseUrl}/export?${searchParams}`, {
      // @ts-expect-error - ky supports blob response
      responseType: 'blob',
    });
    return data as unknown as Blob;
  }
}

export const auditService = new AuditService();
