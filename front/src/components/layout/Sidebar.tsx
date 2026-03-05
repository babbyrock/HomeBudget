import { NavLink } from 'react-router-dom'
import { Users, Tag, ArrowLeftRight, BarChart2, PieChart, Wallet } from 'lucide-react'
import styles from './Sidebar.module.scss'

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.active : ''}`
      }
    >
      <span className={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <Wallet size={18} />
        </div>
        <div>
          <div className={styles.logoText}>HomeBudget</div>
          <div className={styles.logoSub}>Controle de gastos</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Cadastros</span>
        <NavItem to="/pessoas"    icon={<Users size={15} />}          label="Pessoas"    />
        <NavItem to="/categorias" icon={<Tag size={15} />}            label="Categorias" />
        <NavItem to="/transacoes" icon={<ArrowLeftRight size={15} />} label="Transações" />

        <span className={styles.sectionLabel}>Relatórios</span>
        <NavItem to="/relatorios/pessoas"    icon={<BarChart2 size={15} />} label="Por Pessoa"   />
        <NavItem to="/relatorios/categorias" icon={<PieChart size={15} />}  label="Por Categoria" />
      </nav>

    </aside>
  )
}
