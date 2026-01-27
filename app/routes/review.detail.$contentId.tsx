import { ContentCrawlDetailPageComponent } from '@/features/content';
import { createRoute } from '@tanstack/react-router';
import { ContentProvider } from '@/features/content/components';
import { mainLayoutRoute } from './_main';

export const reviewDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/review/detail/$contentId',
  component: () => (
    <ContentProvider>
      <ContentCrawlDetailPageComponent />
    </ContentProvider>
  ),
});
