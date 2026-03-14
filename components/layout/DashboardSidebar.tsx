import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Inicio',    icon: '🏠' },
  { href: '/mood',      label: 'Ánimo',     icon: '😊' },
  { href: '/habits',    label: 'Hábitos',   icon: '🌿' },
  { href: '/history',   label: 'Historial', icon: '📊' },
  { href: '/settings',  label: 'Ajustes',   icon: '⚙️' },
]

export function DashboardSidebar() {
  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card px-4 py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          E
        </div>
        <span className="font-semibold tracking-tight">EquilibraMente</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
