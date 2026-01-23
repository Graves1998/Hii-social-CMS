import { DetailPageComponent } from '@/features/content';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const detailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/detail/$contentId',
  component: DetailPageComponent,
});
