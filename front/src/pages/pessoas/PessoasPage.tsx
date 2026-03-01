// ============================================================
// pages/pessoas/PessoasPage.tsx
//
// Tecnologias:
//  - React Query → busca/mutações de dados
//  - Zustand     → controla qual modal está aberto
//  - React Hook Form + Zod → formulários com validação
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Pencil, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'

import { pessoasApi } from '@/api/pessoas'
import { queryKeys } from '@/api/queryKeys'
import { pessoaSchema, type PessoaFormValues } from '@/schemas'
import { useUiStore } from '@/store/uiStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import type { Pessoa } from '../types'
import styles from './PessoasPage.module.scss'

// ---- Formulário compartilhado (criar / editar) ----
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
        {/* Campo: Nome */}
        <Field label="Nome *" error={errors.nome?.message}>
          <input
            {...register('nome')}
            className={`field-input ${errors.nome ? 'error' : ''}`}
            placeholder="Nome completo"
            autoFocus
          />
        </Field>

        {/* Campo: Idade */}
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

// ---- Modal de confirmação de exclusão ----
function DeleteConfirmModal({ pessoa, onClose }: { pessoa: Pessoa; onClose: () => void }) {
  const qc = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => pessoasApi.delete(pessoa.id),
    onSuccess: () => {
      // Invalida cache de pessoas E transações (cascata)
      qc.invalidateQueries({ queryKey: queryKeys.pessoas })
      qc.invalidateQueries({ queryKey: queryKeys.transacoes })
      qc.invalidateQueries({ queryKey: queryKeys.relatorioPorPessoa })
      qc.invalidateQueries({ queryKey: queryKeys.relatorioPorCategoria })
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
          ⚠ Todas as transações desta pessoa serão excluídas permanentemente.
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

// ---- Página principal ----
export default function PessoasPage() {
  const { activeModal, targetPessoa, openModal, closeModal } = useUiStore()
  const qc = useQueryClient()

  // ---- Queries ----
  const { data: pessoas = [], isLoading } = useQuery({
    queryKey: queryKeys.pessoas,
    queryFn: pessoasApi.list,
  })

  // ---- Mutation: criar ----
  const createMutation = useMutation({
    mutationFn: pessoasApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pessoas })
      toast.success('Pessoa criada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  // ---- Mutation: editar ----
  const updateMutation = useMutation({
    mutationFn: (data: PessoaFormValues) => pessoasApi.update(targetPessoa!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.pessoas })
      toast.success('Pessoa atualizada!')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pessoas</h1>
          <p className="page-subtitle">Cadastro e gerenciamento de pessoas</p>
        </div>
        <Button variant="primary" onClick={() => openModal('createPessoa')}>
          <UserPlus size={15} /> Nova pessoa
        </Button>
      </div>

      {/* Body */}
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
                    <td className={`mono ${styles.idx}`}>{i + 1}</td>
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
                        <button className={styles.iconBtn} title="Editar"
                          onClick={() => openModal('editPessoa', p)}>
                          <Pencil size={14} />
                        </button>
                        <button className={`${styles.iconBtn} ${styles.danger}`} title="Excluir"
                          onClick={() => openModal('deletePessoa', p)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Criar */}
      {activeModal === 'createPessoa' && (
        <Modal title="Nova Pessoa" onClose={closeModal}>
          <PessoaForm
            onSubmit={(data) => createMutation.mutate(data)}
            onClose={closeModal}
            isLoading={createMutation.isPending}
            submitLabel="Criar pessoa"
          />
        </Modal>
      )}

      {/* Modal: Editar */}
      {activeModal === 'editPessoa' && targetPessoa && (
        <Modal title="Editar Pessoa" onClose={closeModal}>
          <PessoaForm
            defaultValues={{ nome: targetPessoa.nome, idade: targetPessoa.idade }}
            onSubmit={(data) => updateMutation.mutate(data)}
            onClose={closeModal}
            isLoading={updateMutation.isPending}
            submitLabel="Salvar alterações"
          />
        </Modal>
      )}

      {/* Modal: Deletar */}
      {activeModal === 'deletePessoa' && targetPessoa && (
        <Modal title="Excluir Pessoa" onClose={closeModal}>
          <DeleteConfirmModal pessoa={targetPessoa} onClose={closeModal} />
        </Modal>
      )}
    </>
  )
}
