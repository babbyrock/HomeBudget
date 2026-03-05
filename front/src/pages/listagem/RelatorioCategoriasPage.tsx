import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PieChart, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { relatoriosApi } from '@/api/relatorios'
import { queryKeys } from '@/api/queryKeys'
import Button from '@/components/ui/Button'
import { formatCurrency, saldoClass } from '@/utils/format'
import type { TotalCategoria } from '@/types'
import styles from './RelatorioPage.module.scss'

const PAGE_SIZE = 10

export default function RelatorioCategoriasPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: queryKeys.relatorioPorCategoria(page, PAGE_SIZE),
    queryFn: () => relatoriosApi.porCategoria(page, PAGE_SIZE),
  })

  const itens = data?.categorias?.items ?? []

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Totais por Categoria</h1>
          <p className="page-subtitle">Distribuição financeira por categoria</p>
        </div>
        <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={13} className={isFetching ? styles.spin : ''} />
          Atualizar
        </Button>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : itens.length === 0 ? (
          <div className="empty-state">
            <PieChart size={44} />
            <p>Cadastre categorias e transações para visualizar o relatório.</p>
          </div>
        ) : (
          <>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Receitas</span>
                <span className={`${styles.statValue} ${styles.green}`}>
                  {formatCurrency(data.totalGeralReceitas)}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Despesas</span>
                <span className={`${styles.statValue} ${styles.red}`}>
                  {formatCurrency(data.totalGeralDespesas)}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Saldo Líquido</span>
                <span className={`${styles.statValue} ${data.saldoLiquido >= 0 ? styles.green : styles.red}`}>
                  {formatCurrency(data.saldoLiquido)}
                </span>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th className={styles.right}>Receitas</th>
                    <th className={styles.right}>Despesas</th>
                    <th className={styles.right}>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item: TotalCategoria) => (
                    <tr key={item.id}>
                      <td className={styles.nome}>{item.descricao}</td>
                      <td className={styles.right}>
                        <span className="val-pos">{formatCurrency(item.totalReceitas)}</span>
                      </td>
                      <td className={styles.right}>
                        <span className="val-neg">{formatCurrency(item.totalDespesas)}</span>
                      </td>
                      <td className={styles.right}>
                        <span className={saldoClass(item.saldo)}>{formatCurrency(item.saldo)}</span>
                      </td>
                    </tr>
                  ))}

                  {!data?.categorias?.hasNext && (
                    <tr className={styles.totalRow}>
                      <td>Total Geral</td>
                      <td className={styles.right}>
                        <span className="val-pos">{formatCurrency(data.totalGeralReceitas)}</span>
                      </td>
                      <td className={styles.right}>
                        <span className="val-neg">{formatCurrency(data.totalGeralDespesas)}</span>
                      </td>
                      <td className={styles.right}>
                        <span className={saldoClass(data.saldoLiquido)}>
                          {formatCurrency(data.saldoLiquido)}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data?.categorias && data.categorias.totalPages > 0 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!data.categorias.hasPrevious}
                >
                  <ChevronLeft size={14} /> Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {data.categorias.page} de {data.categorias.totalPages}
                  <span className="text-muted"> ({data.categorias.totalItems} categorias)</span>
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.categorias.hasNext}
                >
                  Próxima <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}