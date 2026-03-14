import Link from 'next/link'

import Image from 'next/image'

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
      <div className="mb-8 flex items-center gap-2 px-2">
        <Image src="/logo.png" alt="Logo EquilibraMente" width={32} height={32} className="w-auto h-auto" />
        <span className="font-semibold tracking-tight text-xl" style={{ fontFamily: 'var(--font-display)' }}>EquilibraMente</span>
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
