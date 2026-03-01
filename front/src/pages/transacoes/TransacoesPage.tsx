// ============================================================
// pages/transacoes/TransacoesPage.tsx
//
// Regras de negócio no formulário:
//  1. Ao selecionar pessoa < 18 anos → tipo bloqueado em 'despesa'
//  2. Categorias filtradas por compatibilidade com o tipo escolhido
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMemo } from 'react'

import { transacoesApi } from '@/api/transacoes'
import { pessoasApi } from '@/api/pessoas'
import { categoriasApi } from '@/api/categorias'
import { queryKeys } from '@/api/queryKeys'
import { transacaoSchema, type TransacaoFormValues } from '@/schemas'
import { useUiStore } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { formatCurrency } from '@/utils/format'
import styles from './TransacoesPage.module.scss'

// ---- Formulário ----
function TransacaoForm({ onClose, isLoading, onSubmit }: {
  onClose: () => void
  isLoading: boolean
  onSubmit: (data: TransacaoFormValues) => void
}) {
  const { data: pessoas = [] } = useQuery({ queryKey: queryKeys.pessoas, queryFn: pessoasApi.list })
  const { data: categorias = [] } = useQuery({ queryKey: queryKeys.categorias, queryFn: categoriasApi.list })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransacaoFormValues>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: { descricao: '', valor: undefined, tipo: 'despesa', pessoaId: '', categoriaId: '' },
  })

  // Observa campos para aplicar regras de negócio reativamente
  const pessoaId  = useWatch({ control, name: 'pessoaId' })
  const tipoAtual = useWatch({ control, name: 'tipo' })

  // Verifica se a pessoa selecionada é menor de 18
  const pessoaSel = useMemo(() => pessoas.find((p) => p.id === pessoaId), [pessoas, pessoaId])
  const ehMenor   = pessoaSel ? pessoaSel.idade < 18 : false

  // Se menor de idade, força tipo = despesa
  useMemo(() => {
    if (ehMenor) setValue('tipo', 'despesa')
  }, [ehMenor, setValue])

  // Filtra categorias compatíveis com o tipo selecionado
  const categoriasFiltradas = useMemo(
    () => categorias.filter((c) => c.finalidade === tipoAtual || c.finalidade === 'ambas'),
    [categorias, tipoAtual]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        {/* Descrição */}
        <Field label="Descrição *" error={errors.descricao?.message}>
          <input
            {...register('descricao')}
            className={`field-input ${errors.descricao ? 'error' : ''}`}
            placeholder="Descreva a transação"
            autoFocus
          />
        </Field>

        {/* Valor */}
        <Field label="Valor (R$) *" error={errors.valor?.message}>
          <input
            {...register('valor', { valueAsNumber: true })}
            type="number"
            min={0.01}
            step={0.01}
            className={`field-input ${errors.valor ? 'error' : ''}`}
            placeholder="0,00"
          />
        </Field>

        {/* Pessoa */}
        <Field label="Pessoa *" error={errors.pessoaId?.message}>
          <select {...register('pessoaId')} className={`field-select ${errors.pessoaId ? 'error' : ''}`}>
            <option value="">Selecione uma pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}{p.idade < 18 ? ' (menor de idade)' : ''}
              </option>
            ))}
          </select>
        </Field>

        {/* Tipo — bloqueado se menor de idade */}
        <Field
          label="Tipo *"
          error={errors.tipo?.message}
          hint={ehMenor ? '⚠ Menores de 18 anos só podem registrar despesas.' : undefined}
        >
          <select
            {...register('tipo')}
            className={`field-select ${errors.tipo ? 'error' : ''}`}
            disabled={ehMenor}
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </Field>

        {/* Categoria — filtrada pelo tipo */}
        <Field label="Categoria *" error={errors.categoriaId?.message}
          hint={categoriasFiltradas.length === 0 ? 'Nenhuma categoria disponível para este tipo.' : undefined}>
          <select {...register('categoriaId')} className={`field-select ${errors.categoriaId ? 'error' : ''}`}>
            <option value="">Selecione uma categoria</option>
            {categoriasFiltradas.map((c) => (
              <option key={c.id} value={c.id}>{c.descricao}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="modal-footer">
        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={isLoading}>Registrar transação</Button>
      </div>
    </form>
  )
}

// ---- Página ----
export default function TransacoesPage() {
  const { activeModal, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()

  const { data: transacoes = [], isLoading } = useQuery({
    queryKey: queryKeys.transacoes,
    queryFn: transacoesApi.list,
  })

  const createMutation = useMutation({
    mutationFn: transacoesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transacoes })
      qc.invalidateQueries({ queryKey: queryKeys.relatorioPorPessoa })
      qc.invalidateQueries({ queryKey: queryKeys.relatorioPorCategoria })
      toast.success('Transação registrada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">Registro de receitas e despesas</p>
        </div>
        <Button variant="primary" onClick={() => openModal('createTransacao')}>
          <Plus size={15} /> Nova transação
        </Button>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : transacoes.length === 0 ? (
          <div className="empty-state">
            <ArrowLeftRight size={44} />
            <p>Nenhuma transação registrada.</p>
            <Button variant="primary" onClick={() => openModal('createTransacao')}>
              Registrar primeira transação
            </Button>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t, i) => (
                  <tr key={t.id}>
                    <td className="mono text-muted text-xs">{i + 1}</td>
                    <td className={styles.desc}>{t.descricao}</td>
                    <td className="text-sm">{t.pessoaNome}</td>
                    <td className="text-sm">{t.categoriaNome}</td>
                    <td>
                      {t.tipo === 'receita'
                        ? <span className={styles.badgeGreen}><TrendingUp size={10} />Receita</span>
                        : <span className={styles.badgeRed}><TrendingDown size={10} />Despesa</span>
                      }
                    </td>
                    <td className={styles.valor}>
                      <span className={t.tipo === 'receita' ? 'val-pos' : 'val-neg'}>
                        {t.tipo === 'despesa' ? '−' : '+'}{formatCurrency(t.valor)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeModal === 'createTransacao' && (
        <Modal title="Nova Transação" onClose={closeModal}>
          <TransacaoForm
            onSubmit={(data) => createMutation.mutate(data)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
          />
        </Modal>
      )}
    </>
  )
}
