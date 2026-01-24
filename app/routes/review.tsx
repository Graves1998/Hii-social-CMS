import { ContentCrawlPageComponent } from '@/features/content/pages';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const reviewRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/review',
  component: ContentCrawlPageComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as string) || 'ALL',
      source: (search.source as string) || 'ALL',
    };
  },
});
