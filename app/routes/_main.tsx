import { createRoute, Outlet } from '@tanstack/react-router';
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
});

function MainLayoutComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
