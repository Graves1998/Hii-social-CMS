import { createRoute } from '@tanstack/react-router';
import CreatePageComponent from '@/features/content/pages/create-page';
import { rootRoute } from './_root';

export const createContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePageComponent,
});
