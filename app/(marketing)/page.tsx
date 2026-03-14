import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

// Datos de la página — sin hardcodear en el JSX
const features = [
  {
    icon: '🎯',
    title: 'Registro diario de ánimo',
    description:
      'Escala del 1 al 5 con nota opcional. Solo toma 10 segundos. Sin formularios largos ni preguntas complejas.',
  },
  {
    icon: '🌿',
    title: 'Seguimiento de hábitos',
    description:
      'Registra sueño, ejercicio, pausas activas y más. Marca cada día con un solo clic.',
  },
  {
    icon: '📊',
    title: 'Visualiza tus tendencias',
    description:
      'Gráficos semanales y mensuales que revelan patrones en tu bienestar emocional.',
  },
  {
    icon: '🔒',
    title: 'Privado y seguro',
    description:
      'Tus datos son tuyos. Sin anuncios, sin venta de información, sin integración con redes sociales.',
  },
  {
    icon: '⚡',
    title: 'Rápido y simple',
    description:
      'Diseñado para adultos jóvenes ocupados. El registro diario completo toma menos de 2 minutos.',
  },
  {
    icon: '📱',
    title: 'Desde cualquier dispositivo',
    description:
      'Funciona en computador, tablet y celular. Accede desde el navegador, sin instalar nada.',
  },
]

const steps = [
  { number: '01', title: 'Crea tu cuenta', description: 'Registro en menos de 30 segundos. Solo email y contraseña.' },
  { number: '02', title: 'Registra tu día', description: 'Indica cómo te sientes y qué hábitos cumpliste hoy.' },
  { number: '03', title: 'Descubre patrones', description: 'Visualiza semanas y meses para entender tu bienestar.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="EquilibraMente Logo" width={32} height={32} className="cursor-pointer" />
            <span className="text-lg font-semibold tracking-tight cursor-pointer">EquilibraMente</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="cursor-pointer">
              <Button variant="ghost" size="sm" className="cursor-pointer">Iniciar sesión</Button>
            </Link>
            <Link href="/register" className="cursor-pointer">
              <Button size="sm" className="cursor-pointer">Comenzar gratis</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden px-6 py-24 md:py-36">
          {/* Decoración de fondo — ondas sutiles */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary), transparent)`,
            }}
          />
          <div className="relative mx-auto max-w-6xl grid items-center gap-12 lg:grid-cols-2">
            
            {/* Texto Hero */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                🌿 Bienestar emocional para adultos jóvenes
              </Badge>
              <h1
                className="mb-6 text-5xl font-normal leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tu bienestar,{' '}
                <span className="text-primary">en equilibrio</span>
              </h1>
              <p className="mx-auto lg:mx-0 mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Registra tu estado de ánimo y hábitos de autocuidado cada día.
                Descubre patrones, entiéndete mejor y toma el control de tu bienestar emocional.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/register" className="cursor-pointer w-full sm:w-auto">
                  <Button size="lg" className="h-12 w-full px-8 text-base">
                    Comenzar gratis
                  </Button>
                </Link>
                <Link href="/login" className="cursor-pointer w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center lg:text-left">
                Sin tarjeta de crédito · Sin anuncios · 100% gratuito
              </p>
            </div>

            {/* Ilustración Hero */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
              <div className="relative aspect-square w-full max-w-[500px]">
                {/* Glow decorativo de fondo */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <Image 
                  src="/hero-illustration.png" 
                  alt="Ilustración 3D de balance y bienestar" 
                  fill 
                  className="object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out" 
                  priority
                />
              </div>
            </div>

          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="border-y border-border bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <h2
                className="mb-3 text-3xl font-normal md:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Simple de usar, poderoso en el tiempo
              </h2>
              <p className="text-muted-foreground">
                Tres pasos para empezar a entender tu bienestar emocional
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <span className="text-xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2
                className="mb-3 text-3xl font-normal md:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Todo lo que necesitas, nada que sobre
              </h2>
              <p className="text-muted-foreground">
                Funciones pensadas para adultos jóvenes que estudian y trabajan
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="cursor-pointer border-border/50 bg-card transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="mb-4 text-3xl">{feature.icon}</div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ESTADO DE ÁNIMO VISUAL — sección explicativa */}
        <section className="border-y border-border bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <Badge variant="secondary" className="mb-4">Registro de ánimo</Badge>
                <h2
                  className="mb-4 text-3xl font-normal md:text-4xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ¿Cómo te sientes hoy?
                </h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Una escala del 1 al 5 con una nota opcional. Sin diagnósticos, sin presión.
                  Solo un registro honesto de cómo estás cada día.
                </p>
                <ul className="space-y-3">
                  {['Registro en menos de 10 segundos', 'Nota opcional para más contexto', 'Un registro por día, siempre editable'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup visual del picker de ánimo */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <p className="mb-6 text-center text-sm font-medium text-muted-foreground">¿Cómo fue tu día?</p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { score: 1, emoji: '😔', label: 'Muy mal' },
                    { score: 2, emoji: '😕', label: 'Mal' },
                    { score: 3, emoji: '😐', label: 'Regular' },
                    { score: 4, emoji: '🙂', label: 'Bien' },
                    { score: 5, emoji: '😄', label: 'Muy bien' },
                  ].map((item) => (
                    <div
                      key={item.score}
                      className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all cursor-pointer ${
                        item.score === 4
                          ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                          : 'bg-muted hover:bg-primary/20'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs font-medium">{item.score}</span>
                    </div>
                  ))}
                </div>
                <p className={`mt-6 text-center text-sm font-medium text-primary`}>
                  Bien 🙂
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-4 text-4xl font-normal md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Empieza hoy.
              <br />
              <span className="text-primary">Es gratis.</span>
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Únete y comienza a registrar tu bienestar emocional desde el primer día.
            </p>
            <Link href="/register" className="cursor-pointer">
              <Button size="lg" className="h-14 px-12 text-lg">
                Crear mi cuenta gratis
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <Image src="/logo.png" alt="EquilibraMente Logo" width={24} height={24} className="grayscale brightness-50 contrast-200 dark:invert" />
            <span>EquilibraMente</span>
          </div>
          <p>Proyecto de Título — Ingeniería en Informática · {new Date().getFullYear()}</p>
          <div className="flex gap-4">
            <Link href="/login" className="cursor-pointer hover:text-foreground transition-colors">Iniciar sesión</Link>
            <Link href="/register" className="cursor-pointer hover:text-foreground transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
