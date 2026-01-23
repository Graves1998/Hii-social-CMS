import { createRoute } from '@tanstack/react-router';
import AuditPageComponent from '@/features/audit/pages/audit-page';
import { rootRoute } from './_root';

export const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audit',
  component: AuditPageComponent,
});
