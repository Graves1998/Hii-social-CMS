import { createRoute } from '@tanstack/react-router';
import { DashboardPageComponent } from '@/features/dashboard';
import { rootRoute } from './_root';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPageComponent,
});
