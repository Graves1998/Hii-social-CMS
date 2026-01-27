import React, { useContext, createContext, useMemo } from 'react';
import { Application, Category } from '../types';
import { usePlatforms } from '../hooks/usePlatform';
import { useCategories } from '../hooks/useCategory';

type ContentContextType = {
  platforms: Application[];
  categories: Category[];
};

const ContentContext = createContext<ContentContextType>({
  categories: [],
  platforms: [],
});

function ContentProvider({ children }: { children: React.ReactNode }) {
  const platforms = usePlatforms();
  const categories = useCategories();

  const value = useMemo(
    () => ({
      platforms: platforms.data?.applications || [],
      categories: categories.data?.categories || [],
    }),
    [platforms, categories]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentContext must be used within a ContentContextProvider');
  }
  return context;
};

export { useContentContext, ContentProvider };
