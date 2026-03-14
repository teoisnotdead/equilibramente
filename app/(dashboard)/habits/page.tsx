import { auth }          from '@/lib/auth'
import { redirect }      from 'next/navigation'
import { habitService }  from '@/lib/services/habit.service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HabitsManager } from '@/components/habits/HabitsManager'
import { DashboardHabitsSection } from '@/components/habits/DashboardHabitsSection'

export default async function HabitsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const today  = new Date().toISOString().split('T')[0]
  const habits = await habitService.getAll(session.user.id)
  const logs   = await habitService.getTodayLogs(session.user.id)

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-normal"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Mis hábitos
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hábitos de hoy</CardTitle>
            <CardDescription>Marca los que cumpliste</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardHabitsSection
              logs={logs.data ?? []}
              today={today}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agregar hábito</CardTitle>
            <CardDescription>Nuevo hábito de autocuidado</CardDescription>
          </CardHeader>
          <CardContent>
            <HabitsManager habits={habits.data ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
