import { ContentItem, ContentStatus, MediaType, SourcePlatform, SourceType, Video } from '../types';

export const transformCrawlContent = (content: Video): ContentItem => {
  return {
    title: content.video_metadata.title,
    short_description: content.video_metadata.description,
    thumbnail_url: content.thumbnail_url,
    content_id: content.video_id,
    media_type: MediaType.VIDEO,
    media_url: content.original_url,
    source_type: SourceType.CRAWL,
    source_platform: content.platform as SourcePlatform,
    target_platforms: [],
    original_source_url: content.original_url,
    created_at: content.created_at,
    created_by: content.publish_metadata.data.updated_by,
    status: ContentStatus.PENDING_REVIEW,
    category: '',
    tags: [],
    visibility: 'public',
    moderation_notes: '',
  };
};
