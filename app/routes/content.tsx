import { createRoute } from '@tanstack/react-router';
import ContentPageComponent from '@/features/content/pages/content-page';
import { mainLayoutRoute } from './_main';

export const contentRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/content',
  component: ContentPageComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as string) || 'ALL',
      source: (search.source as string) || 'ALL',
    };
  },
});
