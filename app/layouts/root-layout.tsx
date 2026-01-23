import { createRoute, createRouter, redirect } from '@tanstack/react-router';
import { rootRoute, type RouterContext } from '../routes/_root';
import { authLayoutRoute } from '../routes/_auth';
import { auditRoute } from '../routes/audit';
import { contentRoute } from '../routes/content';
import { createContentRoute } from '../routes/create';
import { dashboardRoute } from '../routes/dashboard';
import { detailRoute } from '../routes/detail.$contentId';
import { loginRoute } from '../routes/login';
import { registerRoute } from '../routes/register';
import { mainLayoutRoute } from '../routes/_main';

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
  // Auth routes với layout riêng (không có sidebar)
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  // Main app routes với MainLayout (có sidebar)
  mainLayoutRoute.addChildren([
    dashboardRoute,
    contentRoute,
    detailRoute,
    auditRoute,
    createContentRoute,
  ]),
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
