/**
 * Content Types
 *
 * Re-export shared types for review feature
 */

import { Pagination } from '@/lib/types/api-client';

export * from '@/shared/types';

export interface MakeVideoCrawlerPayload {
  is_previewed: boolean;
  message: string;
  //   video_id: number;
}

export interface Video {
  created_at: string;
  download_attempts: number;
  download_error: string;
  download_status: string;
  id: number;
  is_previewed: boolean;
  is_published: boolean;
  original_url: string;
  platform: string;
  publish_attempts: number;
  publish_error: string;
  publish_metadata: PublishMetadata;
  published_at: string;
  storage_url: string;
  thumbnail_url: string;
  video_id: string;
  video_metadata: VideoMetadata;
}

export interface PublishMetadata {
  code: number;
  data: Data;
  message: string;
  success: boolean;
  timestamp: number;
}

export interface Data {
  approving_status: string;
  content: string;
  created_at: string;
  description: string;
  dislikes: number;
  id: string;
  is_allow_comment: boolean;
  liked: boolean;
  likes: number;
  media: Media[];
  notification_status: string;
  oldest_unread_comment: number;
  owner: string;
  owner_id: string;
  participants: string;
  scheduled_at: string;
  status: string;
  tags: string[];
  thumbnail: Thumbnail;
  title: string;
  total_comments: number;
  total_unread_comments: number;
  type: string;
  updated_at: string;
  updated_by: string;
  views: number;
}

export interface Media {
  download_url: string;
  duration: number;
  poster: string;
  type: string;
  url: string;
}

export interface Thumbnail {
  download_url: string;
  duration: number;
  poster: string;
  type: string;
  url: string;
}

export interface VideoMetadata {
  artists: string[];
  channel_url: string;
  description: string;
  duration: number;
  title: string;
  uploader: string;
}

export interface PaginatedResponse {
  videos: Video[];
  pagination: Pagination;
}
