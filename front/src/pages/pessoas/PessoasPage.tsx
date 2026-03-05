import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Pencil, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { pessoasApi } from '@/api/pessoas'
import { queryKeys } from '@/api/queryKeys'
import { pessoaSchema, type PessoaFormValues } from '@/schemas'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import type { Pessoa } from '@/types'
import styles from './PessoasPage.module.scss'
import { useUiStore } from '@/store/uiStore'

const PAGE_SIZE = 10

interface PessoaFormProps {
  defaultValues?: PessoaFormValues
  onSubmit: (data: PessoaFormValues) => void
  onClose: () => void
  isLoading: boolean
  submitLabel: string
}

function PessoaForm({ defaultValues, onSubmit, onClose, isLoading, submitLabel }: PessoaFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PessoaFormValues>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: defaultValues ?? { nome: '', idade: undefined },
  })

  const idadeValue = watch('idade')
  const ehMenor = typeof idadeValue === 'number' && idadeValue < 18

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        <Field label="Nome *" error={errors.nome?.message}>
          <input
            {...register('nome')}
            className={`field-input ${errors.nome ? 'error' : ''}`}
            placeholder="Nome completo"
            autoFocus
          />
        </Field>

        <Field
          label="Idade *"
          error={errors.idade?.message}
          hint={ehMenor ? '⚠ Menor de 18 anos — só poderá registrar despesas.' : undefined}
        >
          <input
            {...register('idade', { valueAsNumber: true })}
            type="number"
            min={0}
            max={150}
            className={`field-input ${errors.idade ? 'error' : ''}`}
            placeholder="Ex.: 25"
          />
        </Field>
      </div>

      <div className="modal-footer">
        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={isLoading}>{submitLabel}</Button>
      </div>
    </form>
  )
}

function DeleteConfirmModal({ pessoa, onClose }: { pessoa: Pessoa; onClose: () => void }) {
  const qc = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => pessoasApi.delete(pessoa.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pessoas'] })
      qc.invalidateQueries({ queryKey: ['transacoes'] })
      qc.invalidateQueries({ queryKey: ['relatorio'] })
      toast.success(`"${pessoa.nome}" e suas transações foram excluídas.`)
      onClose()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <>
      <div className="modal-body">
        <p className={styles.deleteText}>
          Tem certeza que deseja excluir <strong>{pessoa.nome}</strong>?
        </p>
        <p className={styles.deleteWarn}>
          Todas as transações desta pessoa serão excluídas permanentemente.
        </p>
      </div>
      <div className="modal-footer">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" onClick={() => mutate()} loading={isPending}>
          Confirmar exclusão
        </Button>
      </div>
    </>
  )
}

export default function PessoasPage() {
  const { activeModal, targetPessoa, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pessoas(page, PAGE_SIZE),
    queryFn: () => pessoasApi.list(page, PAGE_SIZE),
  })

  const pessoas = data?.items ?? []

  const createMutation = useMutation({
    mutationFn: pessoasApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pessoas'] })
      toast.success('Pessoa criada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: (formData: PessoaFormValues) =>
      pessoasApi.update(targetPessoa!.id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pessoas'] })
      toast.success('Pessoa atualizada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pessoas</h1>
          <p className="page-subtitle">Cadastro e gerenciamento de pessoas</p>
        </div>
        <Button variant="primary" onClick={() => openModal('createPessoa')}>
          <UserPlus size={15} /> Nova pessoa
        </Button>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loader-wrap"><div className="spinner" /></div>
        ) : pessoas.length === 0 ? (
          <div className="empty-state">
            <Users size={44} />
            <p>Nenhuma pessoa cadastrada.</p>
            <Button variant="primary" onClick={() => openModal('createPessoa')}>
              Cadastrar primeira pessoa
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Perfil</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((p, i) => (
                    <tr key={p.id} className={styles.row}>
                      <td className={`mono ${styles.idx}`}>
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className={styles.nome}>{p.nome}</td>
                      <td>{p.idade} anos</td>
                      <td>
                        {p.idade < 18
                          ? <span className={styles.badgeAmber}>Menor de idade</span>
                          : <span className={styles.badgeBlue}>Maior de idade</span>
                        }
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.iconBtn}
                            title="Editar"
                            onClick={() => openModal('editPessoa', p)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.danger}`}
                            title="Excluir"
                            onClick={() => openModal('deletePessoa', p)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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

      {activeModal === 'createPessoa' && (
        <Modal title="Nova Pessoa" onClose={closeModal}>
          <PessoaForm
            onSubmit={(formData) => createMutation.mutate(formData)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
            submitLabel="Criar pessoa"
          />
        </Modal>
      )}

      {activeModal === 'editPessoa' && targetPessoa && (
        <Modal title="Editar Pessoa" onClose={closeModal}>
          <PessoaForm
            defaultValues={{ nome: targetPessoa.nome, idade: targetPessoa.idade }}
            onSubmit={(formData) => updateMutation.mutate(formData)}
            onClose={closeModal}
            isLoading={updateMutation.isPending}
            submitLabel="Salvar alterações"
          />
        </Modal>
      )}

      {activeModal === 'deletePessoa' && targetPessoa && (
        <Modal title="Excluir Pessoa" onClose={closeModal}>
          <DeleteConfirmModal pessoa={targetPessoa} onClose={closeModal} />
        </Modal>
      )}
    </>
  )
}