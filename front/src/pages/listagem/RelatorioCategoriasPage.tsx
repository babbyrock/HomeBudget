// pages/relatorios/RelatorioCategoriasPage.tsx
import { useQuery } from '@tanstack/react-query'
import { PieChart, RefreshCw } from 'lucide-react'
import { relatoriosApi } from '@/api/relatorios'
import { queryKeys } from '@/api/queryKeys'
import Button from '@/components/ui/Button'
import { formatCurrency, saldoClass, finalidadeLabel } from '@/utils/format'
import type { Finalidade } from '@/types'
import styles from './RelatorioPage.module.scss'

function FinalidadeBadge({ f }: { f: Finalidade }) {
  const cls = { receita: styles.badgeGreen, despesa: styles.badgeRed, ambas: styles.badgePurple }[f]
  return <span className={cls}>{finalidadeLabel[f]}</span>
}

export default function RelatorioCategoriasPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: queryKeys.relatorioPorCategoria,
    queryFn: relatoriosApi.porCategoria,
  })

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
        ) : !data || data.itens.length === 0 ? (
          <div className="empty-state">
            <PieChart size={44} />
            <p>Cadastre categorias e transações para visualizar o relatório.</p>
          </div>
        ) : (
          <>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Receitas</span>
                <span className={`${styles.statValue} ${styles.green}`}>{formatCurrency(data.totalGeralReceitas)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Despesas</span>
                <span className={`${styles.statValue} ${styles.red}`}>{formatCurrency(data.totalGeralDespesas)}</span>
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
                    <th>Finalidade</th>
                    <th className={styles.right}>Receitas</th>
                    <th className={styles.right}>Despesas</th>
                    <th className={styles.right}>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.itens.map((item) => (
                    <tr key={item.categoriaId}>
                      <td className={styles.nome}>{item.categoriaNome}</td>
                      <td><FinalidadeBadge f={item.finalidade} /></td>
                      <td className={styles.right}><span className="val-pos">{formatCurrency(item.totalReceitas)}</span></td>
                      <td className={styles.right}><span className="val-neg">{formatCurrency(item.totalDespesas)}</span></td>
                      <td className={styles.right}><span className={saldoClass(item.saldo)}>{formatCurrency(item.saldo)}</span></td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td colSpan={2}>Total Geral</td>
                    <td className={styles.right}><span className="val-pos">{formatCurrency(data.totalGeralReceitas)}</span></td>
                    <td className={styles.right}><span className="val-neg">{formatCurrency(data.totalGeralDespesas)}</span></td>
                    <td className={styles.right}><span className={saldoClass(data.saldoLiquido)}>{formatCurrency(data.saldoLiquido)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}
