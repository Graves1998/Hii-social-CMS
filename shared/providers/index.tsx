/**
 * App Providers
 *
 * Centralized provider setup for the application
 */

import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
