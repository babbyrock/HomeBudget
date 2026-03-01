// ============================================================
// App.tsx
// Providers: React Query + React Router
// Rotas aninhadas sob o Layout (sidebar)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import Layout from '@/components/layout/Layout'
import PessoasPage from '@/pages/pessoas/PessoasPage'
import CategoriasPage from '@/pages/categorias/CategoriasPage'
import TransacoesPage from '@/pages/transacoes/TransacoesPage'
import RelatorioPessoasPage from '@/pages/listagem/RelatorioPessoasPage'
import RelatorioCategoriasPage from '@/pages/listagem/RelatorioCategoriasPage'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados considerados fresh por 30s — evita refetch desnecessário
      staleTime: 30_000,
      // 3 tentativas em caso de erro de rede
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#26282e',
              color: '#f0f0ec',
              border: '1px solid rgba(255,255,255,0.09)',
              fontSize: '0.875rem',
              fontFamily: "'Epilogue', sans-serif",
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#26282e' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#26282e' } },
          }}
        />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/pessoas" replace />} />
            <Route path="pessoas"                element={<PessoasPage />} />
            <Route path="categorias"             element={<CategoriasPage />} />
            <Route path="transacoes"             element={<TransacoesPage />} />
            <Route path="relatorios/pessoas"     element={<RelatorioPessoasPage />} />
            <Route path="relatorios/categorias"  element={<RelatorioCategoriasPage />} />
            <Route path="*" element={<Navigate to="/pessoas" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Devtools do React Query (só em desenvolvimento) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}