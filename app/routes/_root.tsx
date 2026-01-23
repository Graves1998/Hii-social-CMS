import { CMSService } from '@/services/cmsService';
import { ContentItem, UserRole } from '@/shared/types';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// Define the router context type
export interface RouterContext {
  items: ContentItem[];
  categories: string[];
  tags: string[];
  service: CMSService;
  currentUser: { name: string; role: UserRole };
  setCurrentUser: (user: { name: string; role: UserRole }) => void;
  refreshData: () => void;
}

// Create the root route with context
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
