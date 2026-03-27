'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30s — données "fraîches" pendant 30s, pas de refetch inutile
            gcTime: 5 * 60 * 1000, // 5min — cache gardé en mémoire
            refetchOnWindowFocus: true, // rafraîchit quand l'utilisateur revient sur l'onglet
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
