import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// `retry: false` a propósito: un 429 de TMDB trae su propia espera indicada
// por el servidor, y los reintentos automáticos de Query no la conocen.
// Reintentar sin leerla es el bucle de reintentos que el proyecto prohíbe.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
