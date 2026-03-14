'use client'

import { signOut } from 'next-auth/react'
import { Button }  from '@/components/ui/button'
import type { DefaultSession } from 'next-auth'

interface DashboardNavbarProps {
  user: DefaultSession['user']
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <p className="text-sm text-muted-foreground">
        Hola, <span className="font-medium text-foreground">{user?.name ?? user?.email}</span>
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Cerrar sesión
      </Button>
    </header>
  )
}
