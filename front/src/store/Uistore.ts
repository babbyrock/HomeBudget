// ============================================================
// store/uiStore.ts
// Zustand — gerencia estado global de UI:
//  - Qual modal está aberto
//  - Qual item está sendo editado/deletado
//
// Dados do servidor ficam no React Query (cache),
// estado de UI local fica aqui no Zustand.
// ============================================================

import { create } from 'zustand'
import type { Pessoa } from '../types'

type ModalType = 'createPessoa' | 'editPessoa' | 'deletePessoa' | 'createCategoria' | 'createTransacao' | null

interface UiState {
  // Modal aberto no momento
  activeModal: ModalType
  // Pessoa alvo de edição ou exclusão
  targetPessoa: Pessoa | null

  // Actions
  openModal: (modal: ModalType, pessoa?: Pessoa) => void
  closeModal: () => void
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  targetPessoa: null,

  openModal: (modal, pessoa = undefined) =>
    set({ activeModal: modal, targetPessoa: pessoa }),

  closeModal: () =>
    set({ activeModal: null, targetPessoa: null }),
})) 