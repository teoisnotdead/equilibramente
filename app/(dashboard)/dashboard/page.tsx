import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="secondary">MVP</Badge>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              Bienvenido, {session.user.name ?? session.user.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aquí podrás registrar tu estado de ánimo y hábitos de autocuidado.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
