
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { categoriasApi } from '@/api/categorias'
import { queryKeys } from '@/api/queryKeys'
import { categoriaSchema, type CategoriaFormInput, type CategoriaFormValues } from '@/schemas'
import { useUiStore } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { finalidadeLabel } from '@/utils/format'
import type { Categoria } from '@/types'
import styles from './CategoriasPage.module.scss'

const PAGE_SIZE = 10

function CategoriaForm({ onClose, isLoading, onSubmit }: {
  onClose: () => void
  isLoading: boolean
  onSubmit: (data: CategoriaFormValues) => void
}) {
  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<CategoriaFormInput, unknown, CategoriaFormValues>({
  resolver: zodResolver(categoriaSchema),
  defaultValues: { descricao: '', finalidade: 'Despesa' },
  })

  const descricao = watch('descricao')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        <Field
          label="Descrição *"
          error={errors.descricao?.message}
          hint={`${(descricao ?? '').length}/400 caracteres`}
        >
          <textarea
            {...register('descricao')}
            className={`field-textarea ${errors.descricao ? 'error' : ''}`}
            placeholder="Ex.: Alimentação, Salário, Transporte..."
            autoFocus
          />
        </Field>

        <Field
          label="Finalidade *"
          error={errors.finalidade?.message}
          hint="Define quais tipos de transação podem usar esta categoria."
        >
          <select
            {...register('finalidade')}
            className={`field-select ${errors.finalidade ? 'error' : ''}`}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas</option>
          </select>
        </Field>
      </div>
      <div className="modal-footer">
        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={isLoading}>Criar categoria</Button>
      </div>
    </form>
  )
}

export default function CategoriasPage() {
  const { activeModal, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categorias(page, PAGE_SIZE),
    queryFn: () => categoriasApi.list(page, PAGE_SIZE),
  })

  const categorias = data?.items ?? []

  const createMutation = useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categorias'] })
      toast.success('Categoria criada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const badgeClass = (f: string) => ({
    'Receita': styles.badgeGreen,
    'Despesa': styles.badgeRed,
    'Ambas':   styles.badgePurple,
  }[f] ?? styles.badgeRed)

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Organize suas transações por categoria</p>
        </div>
        <Button variant="primary" onClick={() => openModal('createCategoria')}>
          <Plus size={15} /> Nova categoria
        </Button>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : categorias.length === 0 ? (
          <div className="empty-state">
            <Tag size={44} />
            <p>Nenhuma categoria cadastrada.</p>
            <Button variant="primary" onClick={() => openModal('createCategoria')}>
              Criar primeira categoria
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
                    <th>Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c: Categoria, i: number) => (
                    <tr key={c.id}>
                      <td className="mono text-muted text-xs">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className={styles.desc}>{c.descricao}</td>
                      <td>
                        <span className={badgeClass(c.finalidade)}>
                          {finalidadeLabel[c.finalidade]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.totalItems > 0 && (
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

      {activeModal === 'createCategoria' && (
        <Modal title="Nova Categoria" onClose={closeModal}>
          <CategoriaForm
            onSubmit={(formData) => createMutation.mutate(formData)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
          />
        </Modal>
      )}
    </>
  )
}