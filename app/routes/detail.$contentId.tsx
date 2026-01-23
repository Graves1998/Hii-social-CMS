import { DetailPageComponent } from '@/features/content';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './_root';

export const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/detail/$contentId',
  component: DetailPageComponent,
});
