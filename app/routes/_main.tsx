import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { rootRoute } from './_root';
import { MainLayout } from '../layouts';

/**
 * Main Layout Route - Layout riêng cho main pages
 *
 */
export const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main-layout',
  component: MainLayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw redirect({ to: '/login' });
    }
  },
});

function MainLayoutComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
