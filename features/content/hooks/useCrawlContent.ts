/**
 * React Query Hook Example - Content Management
 *
 * Custom hooks sử dụng React Query để fetch và manage data
 */

import { queryClient, queryKeys } from '@/lib/query-client';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { crawlService } from '../services/crawl-service';
import { useCrawlFilters } from '../stores/useCrawlStore';
import { MakeVideoCrawlerPayload, PaginatedResponse } from '../types';
import { transformCrawlContent } from '../utils';

const useCrawlContent = () => {
  const filters = useCrawlFilters();
  const crawlContentQuery = useInfiniteQuery({
    queryKey: [queryKeys.content.all, filters],
    queryFn: ({ pageParam = 1 }) =>
      crawlService.getContentCrawler({ ...filters, page: pageParam }) as Promise<PaginatedResponse>,
    getNextPageParam: (lastPage: PaginatedResponse) => lastPage.pagination.page + 1,
    initialPageParam: 1,
  });

  return {
    ...crawlContentQuery,
    data:
      crawlContentQuery.data?.pages.flatMap((page) => page.videos.map(transformCrawlContent)) || [],
  };
};

const useMakeVideoCrawler = () => {
  return useMutation({
    mutationFn: ({ video_id, payload }: { video_id: string; payload: MakeVideoCrawlerPayload }) =>
      crawlService.makeVideoCrawler(video_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
    onError: (error) => {},
  });
};

export { useCrawlContent, useMakeVideoCrawler };
