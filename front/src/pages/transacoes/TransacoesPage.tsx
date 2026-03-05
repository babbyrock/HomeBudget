import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { transacoesApi } from '@/api/transacoes'
import { pessoasApi } from '@/api/pessoas'
import { categoriasApi } from '@/api/categorias'
import { queryKeys } from '@/api/queryKeys'
import { transacaoSchema, type TransacaoFormInput, type TransacaoFormValues } from '@/schemas'
import { useUiStore } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { formatCurrency } from '@/utils/format'
import { type Transacao, type Pessoa, type Categoria } from '@/types'
import styles from './TransacoesPage.module.scss'

const PAGE_SIZE = 10

function TransacaoForm({ onClose, isLoading, onSubmit }: {
  onClose: () => void
  isLoading: boolean
  onSubmit: (data: TransacaoFormValues) => void
}) {
  const { data: pessoasData } = useQuery({
    queryKey: queryKeys.pessoas(1, 999),
    queryFn: () => pessoasApi.list(1, 999),
  })
  const { data: categoriasData } = useQuery({
    queryKey: queryKeys.categorias(1, 999),
    queryFn: () => categoriasApi.list(1, 999),
  })

  const pessoas: Pessoa[]       = pessoasData?.items ?? []
  const categorias: Categoria[] = categoriasData?.items ?? []

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransacaoFormInput, unknown, TransacaoFormValues>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: { descricao: '', valor: undefined, tipo: 'Despesa', pessoaId: 0, categoriaId: 0 },
  })

  const pessoaId  = useWatch({ control, name: 'pessoaId' })
  const tipoAtual = useWatch({ control, name: 'tipo' })

  const pessoaSel = useMemo(
    () => pessoas.find((p) => p.id === Number(pessoaId)),
    [pessoas, pessoaId]
  )
  const ehMenor = pessoaSel ? pessoaSel.idade < 18 : false

  useEffect(() => {
    if (ehMenor) setValue('tipo', 'Despesa')
  }, [ehMenor, setValue])

  const categoriasFiltradas = useMemo(
  () => categorias.filter((c) =>
    c.finalidade === (tipoAtual === 'Receita' ? 'Receita' : 'Despesa') ||
    c.finalidade === 'Ambas'
  ),
  [categorias, tipoAtual]
)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        <Field label="Descrição *" error={errors.descricao?.message}>
          <input
            {...register('descricao')}
            className={`field-input ${errors.descricao ? 'error' : ''}`}
            placeholder="Descreva a transação"
            autoFocus
          />
        </Field>

        <Field label="Valor (R$) *" error={errors.valor?.message}>
          <input
            {...register('valor')}
            type="number"
            min={0.01}
            step={0.01}
            className={`field-input ${errors.valor ? 'error' : ''}`}
            placeholder="0,00"
          />
        </Field>

        <Field label="Pessoa *" error={errors.pessoaId?.message}>
          <select {...register('pessoaId')} className={`field-select ${errors.pessoaId ? 'error' : ''}`}>
            <option value={0}>Selecione uma pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}{p.idade < 18 ? ' (menor de idade)' : ''}
              </option>
            ))}
          </select>
        </Field>

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
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </Field>

        <Field
          label="Categoria *"
          error={errors.categoriaId?.message}
          hint={categoriasFiltradas.length === 0 ? 'Nenhuma categoria disponível para este tipo.' : undefined}
        >
          <select {...register('categoriaId')} className={`field-select ${errors.categoriaId ? 'error' : ''}`}>
            <option value={0}>Selecione uma categoria</option>
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

export default function TransacoesPage() {
  const { activeModal, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.transacoes(page, PAGE_SIZE),
    queryFn: () => transacoesApi.list(page, PAGE_SIZE),
  })

  const transacoes: Transacao[] = data?.items ?? []

  const createMutation = useMutation({
    mutationFn: transacoesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transacoes'] })
      qc.invalidateQueries({ queryKey: ['relatorio'] })
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
          <>
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
                  {transacoes.map((t: Transacao, i: number) => (
                    <tr key={t.id}>
                      <td className="mono text-muted text-xs">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className={styles.desc}>{t.descricao}</td>
                      <td className="text-sm">{t.nomePessoa}</td> 
                      <td className="text-sm">{t.nomeCategoria}</td> 
                      <td>
                        {t.tipo === 'Receita'
                          ? <span className={styles.badgeGreen}><TrendingUp size={10} /> Receita</span>
                          : <span className={styles.badgeRed}><TrendingDown size={10} /> Despesa</span>
                        }
                      </td>
                      <td className={styles.valor}>
                        <span className={t.tipo === 'Receita' ? 'val-pos' : 'val-neg'}>
                          {t.tipo === 'Despesa' ? '−' : '+'}{formatCurrency(t.valor)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 0 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!data.hasPrevious}
                >
                  <ChevronLeft size={14} /> Anterior
                </Button>
                <span className={styles.pageInfo}>
                  Página {data.page} de {data.totalPages}
                  <span className="text-muted"> ({data.totalItems} registros)</span>
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.hasNext}
                >
                  Próxima <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {activeModal === 'createTransacao' && (
        <Modal title="Nova Transação" onClose={closeModal}>
          <TransacaoForm
            onSubmit={(formData) => createMutation.mutate(formData)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
          />
        </Modal>
      )}
    </>
  )
}