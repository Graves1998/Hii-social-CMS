import { DetailPageComponent } from '@/features/content';
import { createRoute } from '@tanstack/react-router';
import { ContentProvider } from '@/features/content/components';
import { mainLayoutRoute } from './_main';

export const contentDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/content/detail/$contentId',
  component: () => (
    <ContentProvider>
      <DetailPageComponent />
    </ContentProvider>
  ),
});
