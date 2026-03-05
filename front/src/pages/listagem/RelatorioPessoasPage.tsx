import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { relatoriosApi } from '@/api/relatorios'
import { queryKeys } from '@/api/queryKeys'
import Button from '@/components/ui/Button'
import { formatCurrency, saldoClass } from '@/utils/format'
import type { TotalPessoa } from '@/types'
import styles from './RelatorioPage.module.scss'

const PAGE_SIZE = 10

export default function RelatorioPessoasPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: queryKeys.relatorioPorPessoa(page, PAGE_SIZE),
    queryFn: () => relatoriosApi.porPessoa(page, PAGE_SIZE),
  })

  const itens = data?.pessoas?.items ?? []

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Totais por Pessoa</h1>
          <p className="page-subtitle">Resumo financeiro consolidado por pessoa</p>
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
            <BarChart2 size={44} />
            <p>Cadastre pessoas e transações para visualizar o relatório.</p>
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
                    <th>Pessoa</th>
                    <th className={styles.right}>Receitas</th>
                    <th className={styles.right}>Despesas</th>
                    <th className={styles.right}>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item: TotalPessoa) => (
                    <tr key={item.id}>
                      <td className={styles.nome}>{item.nome}</td>
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

                  {!data?.pessoas?.hasNext && (
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

            {data?.pessoas && data.pessoas.totalPages > 0 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!data.pessoas.hasPrevious}
                >
                  <ChevronLeft size={14} /> Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {data.pessoas.page} de {data.pessoas.totalPages}
                  <span className="text-muted"> ({data.pessoas.totalItems} pessoas)</span>
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.pessoas.hasNext}
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