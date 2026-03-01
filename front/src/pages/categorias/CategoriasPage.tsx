// ============================================================
// pages/categorias/CategoriasPage.tsx
// React Query + React Hook Form + Zod + Zustand
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

import { categoriasApi } from '@/api/categorias'
import { queryKeys } from '@/api/queryKeys'
import { categoriaSchema, type CategoriaFormValues } from '@/schemas'
import { useUiStore } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { finalidadeLabel } from '@/utils/format'
import type { Finalidade } from '../types'
import styles from './CategoriasPage.module.scss'

// ---- Formulário ----
function CategoriaForm({ onClose, isLoading, onSubmit }: {
  onClose: () => void
  isLoading: boolean
  onSubmit: (data: CategoriaFormValues) => void
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { descricao: '', finalidade: 'despesa' },
  })

  const descricao = watch('descricao')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        <Field label="Descrição *" error={errors.descricao?.message}
          hint={`${descricao.length}/400 caracteres`}>
          <textarea
            {...register('descricao')}
            className={`field-textarea ${errors.descricao ? 'error' : ''}`}
            placeholder="Ex.: Alimentação, Salário, Transporte..."
            autoFocus
          />
        </Field>

        <Field label="Finalidade *" error={errors.finalidade?.message}
          hint="Define quais tipos de transação podem usar esta categoria.">
          <select
            {...register('finalidade')}
            className={`field-select ${errors.finalidade ? 'error' : ''}`}
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
            <option value="ambas">Ambas</option>
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

// ---- Página ----
export default function CategoriasPage() {
  const { activeModal, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: queryKeys.categorias,
    queryFn: categoriasApi.list,
  })

  const createMutation = useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categorias })
      toast.success('Categoria criada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const badgeClass = (f: Finalidade) => ({
    receita: styles.badgeGreen,
    despesa: styles.badgeRed,
    ambas:   styles.badgePurple,
  }[f])

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
                {categorias.map((c, i) => (
                  <tr key={c.id}>
                    <td className="mono text-muted text-xs">{i + 1}</td>
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
        )}
      </div>

      {activeModal === 'createCategoria' && (
        <Modal title="Nova Categoria" onClose={closeModal}>
          <CategoriaForm
            onSubmit={(data) => createMutation.mutate(data)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
          />
        </Modal>
      )}
    </>
  )
}
