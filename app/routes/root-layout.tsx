import { createRoute, createRouter, redirect } from '@tanstack/react-router';
import { rootRoute, type RouterContext } from './_root';
import { auditRoute } from './audit';
import { contentRoute } from './content';
import { createContentRoute } from './create';
import { dashboardRoute } from './dashboard';
import { detailRoute } from './detail.$contentId';

// Create index route - redirect to dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect({ to: '/dashboard' });
  },
});

// Build the route tree with all routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  contentRoute,
  detailRoute,
  auditRoute,
  createContentRoute,
]);

// Create and export the router instance
export function createAppRouter(context: RouterContext) {
  return createRouter({
    routeTree,
    context,
  });
}

// Type for the router
export type AppRouter = ReturnType<typeof createAppRouter>;

// Export root route and types for route registration
export { rootRoute, type RouterContext };
