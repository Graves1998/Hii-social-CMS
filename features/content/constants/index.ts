import { ContentStatus, SortOrder } from '@/shared/types';

export const STATUS_LABELS = {
  [ContentStatus.DRAFT]: 'Nháp',
  [ContentStatus.PENDING_REVIEW]: 'Chờ Duyệt',
  [ContentStatus.APPROVED]: 'Đã Duyệt',
  [ContentStatus.SCHEDULED]: 'Đã Lên Lịch',
  [ContentStatus.REJECTED]: 'Bị Từ Chối',
  [ContentStatus.PUBLISHED]: 'Đã Đăng',
  [ContentStatus.ARCHIVED]: 'Lưu Trữ',
};

export const DRAFT_CONTENT_SEARCH_SORT_OPTIONS = [
  { id: SortOrder.ASC, label: 'Mới nhất' },
  { id: SortOrder.DESC, label: 'Cũ nhất' },
];

export const DRAFT_CONTENT_SEARCH_IS_PREVIEWED_OPTIONS = [
  { id: 'false', label: 'Chưa xem trước' },
  { id: 'true', label: 'Đã xem trước' },
];
