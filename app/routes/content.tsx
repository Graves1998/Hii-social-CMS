import { createRoute } from '@tanstack/react-router';
import ContentPageComponent from '@/features/content/pages/content-page';
import { rootRoute } from './_root';

export const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content',
  component: ContentPageComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as string) || 'ALL',
      source: (search.source as string) || 'ALL',
    };
  },
});
