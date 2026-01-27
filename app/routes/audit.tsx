import { createRoute } from '@tanstack/react-router';
import AuditPageComponent from '@/features/audit/pages/audit-page';
import { mainLayoutRoute } from './_main';

export const auditRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/audit',
  component: AuditPageComponent,
});
