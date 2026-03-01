// components/ui/Field.tsx
// Wrapper para campos de formulário com label + mensagem de erro
import styles from './Field.module.scss'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export default function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>⚠ {error}</span>}
    </div>
  )
}
