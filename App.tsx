import { createAppRouter, RouterContext } from '@/app/layouts/root-layout';
import { CMSService } from '@/services/cmsService';
import { INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS } from '@/shared';
import { UserRole } from '@/shared/types';
import { RouterProvider } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useIsAuthenticated } from './features/auth/stores/useAuthStore';
import { Providers } from './shared/providers';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin Moderator',
    role: UserRole.ADMIN,
  });

  const [service] = useState(() => new CMSService(INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS));

  const [contentList, setContentList] = useState(service.getContent());
  const [categories, setCategories] = useState(service.getCategories());
  const [tags, setTags] = useState(service.getTags());

  const refreshData = () => {
    setContentList(service.getContent());
    setCategories(service.getCategories());
    setTags(service.getTags());
  };

  // Create router context
  const routerContext: RouterContext = {
    items: contentList,
    categories,
    tags,
    service,
    currentUser,
    setCurrentUser,
    refreshData,
    isAuthenticated: useIsAuthenticated(),
  };

  // Create router instance with context
  const router = createAppRouter(routerContext);

  return (
    <Providers>
      <RouterProvider router={router} context={routerContext} />
    </Providers>
  );
};

export default App;
