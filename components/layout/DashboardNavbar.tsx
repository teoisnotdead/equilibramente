'use client'

import { signOut } from 'next-auth/react'
import { Button }  from '@/components/ui/button'
import { MobileNav } from '@/components/layout/MobileNav'
import type { DefaultSession } from 'next-auth'

interface DashboardNavbarProps {
  user: DefaultSession['user']
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      {/* Left: mobile menu trigger */}
      <MobileNav />

      {/* Greeting — hidden on mobile when menu button is showing */}
      <p className="hidden md:block text-sm text-muted-foreground">
        Hola, <span className="font-medium text-foreground">{user?.name ?? user?.email}</span>
      </p>

      {/* Spacer so sign-out stays right on mobile */}
      <div className="flex-1 md:hidden" />

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
