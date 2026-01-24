/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CrawlState {
  // State
  filters: {
    page: number;
    page_size: number;
    sort_order: 'asc' | 'desc';
    sort_by: 'created_at' | 'updated_at';
    limit: number;
  };
  setFilters: (key: keyof CrawlState['filters'], value: any) => void;
  resetFilters: () => void;
}

/**
 * Auth Store với persistence
 */
export const useCrawlStore = create<CrawlState>()(
  persist(
    (set) => ({
      filters: {
        page: 1,
        page_size: 10,
        sort_order: 'asc',
        sort_by: 'created_at',
        limit: 10,
      },
      setFilters: (key: keyof CrawlState['filters'], value: any) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: { page: 1, page_size: 10, sort_order: 'asc', sort_by: 'created_at', limit: 10 },
        }),
    }),
    {
      name: 'content-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({}),
    }
  )
);

/**
 * Selectors - Tối ưu re-renders
 */
export const useCrawl = () => useCrawlStore((state) => state);
export const useCrawlFilters = () => useCrawlStore((state) => state.filters);
