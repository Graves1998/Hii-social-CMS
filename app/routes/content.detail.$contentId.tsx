import { contentDetailSearchSchema, DetailPageComponent } from '@/features/content';
import { ContentProvider } from '@/features/content/components';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const contentDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/content/detail/$contentId',
  component: () => (
    <ContentProvider>
      <DetailPageComponent />
    </ContentProvider>
  ),
  validateSearch: contentDetailSearchSchema,
});
