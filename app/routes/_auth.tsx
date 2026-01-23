import { createRoute, Outlet } from '@tanstack/react-router';
import { rootRoute } from './_root';

/**
 * Auth Layout Route - Layout riêng cho authentication pages
 * Không có MainLayout (sidebar, header)
 */
export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <div className="bg-background min-h-screen">
      <Outlet />
    </div>
  );
}
