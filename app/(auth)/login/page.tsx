'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'

const quotes = [
  "Equilibra tu mente, un día a la vez.",
  "El bienestar es un viaje, no un destino.",
  "Tómate un momento para respirar y reconectar.",
  "Tu paz mental es tu mayor tesoro.",
  "Pequeños hábitos construyen grandes cambios."
]

export default function LoginPage() {
  const router = useRouter()
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [quote, setQuote]     = useState(quotes[0])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)

    const result = await signIn('credentials', {
      email:    form.get('email') as string,
      password: form.get('password') as string,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Correo o contraseña incorrectos')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r selection:bg-white selection:text-primary" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-auto brightness-0 invert" />
          <span style={{ fontFamily: 'var(--font-display)' }}>EquilibraMente</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 p-4 h-screen flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-4">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-auto" />
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>EquilibraMente</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para entrar a tu cuenta
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 pb-6">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="cursor-pointer underline underline-offset-4 hover:text-primary">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
