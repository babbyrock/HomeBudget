import { create } from 'zustand'
import type { Pessoa } from '../types'

type ModalType = 'createPessoa' | 'editPessoa' | 'deletePessoa' | 'createCategoria' | 'createTransacao' | null

interface UiState {
  activeModal: ModalType
  targetPessoa: Pessoa | null

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