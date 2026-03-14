import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-normal"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Configuración
      </h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Mi cuenta</CardTitle>
          <CardDescription>Información de tu perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Nombre</span>
            <span className="text-sm font-medium">{session.user.name ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Correo</span>
            <span className="text-sm font-medium">{session.user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Plan</span>
            <Badge variant="secondary">Gratuito</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
