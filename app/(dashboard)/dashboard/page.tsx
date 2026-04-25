import { auth }          from '@/lib/auth'
import { redirect }      from 'next/navigation'
import { moodService }   from '@/lib/services/mood.service'
import { habitService }  from '@/lib/services/habit.service'
import { statsService }  from '@/lib/services/stats.service'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { Badge }         from '@/components/ui/badge'
import { DashboardMoodSection }   from '@/components/mood/DashboardMoodSection'
import { DashboardHabitsSection } from '@/components/habits/DashboardHabitsSection'
import { MoodTrendChart }         from '@/components/charts/MoodTrendChart'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [todayMood, todayHabits, weekStats] = await Promise.all([
    moodService.getToday(session.user.id),
    habitService.getTodayLogs(session.user.id),
    statsService.getStats(session.user.id, 'week'),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl font-normal text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ¿Cómo estás hoy?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date().toLocaleDateString('es-CL', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estado de ánimo de hoy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de ánimo</CardTitle>
            <CardDescription>
              {todayMood.data ? 'Registro de hoy guardado' : 'Aún no has registrado hoy'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMoodSection
              todayEntry={todayMood.data ?? null}
              today={today}
            />
          </CardContent>
        </Card>

        {/* Hábitos de hoy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hábitos de hoy</CardTitle>
            <CardDescription>
              {todayHabits.data
                ? `${todayHabits.data.filter((l) => l.completed).length} de ${todayHabits.data.length} completados`
                : 'Cargando hábitos...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardHabitsSection
              logs={todayHabits.data ?? []}
              today={today}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tendencia semanal */}
      {weekStats.data && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Tendencia de Ánimo Semanal</CardTitle>
              <CardDescription>
                {weekStats.data.moodAverage !== null
                  ? `Promedio de ánimo: ${weekStats.data.moodAverage} / 5`
                  : 'Sin registros esta semana'}
              </CardDescription>
            </div>
            {weekStats.data.habitCompliance && weekStats.data.habitCompliance.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                {[...weekStats.data.habitCompliance].sort((a, b) => b.percentage - a.percentage).map(habit => {
                  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary"
                  let icon = "🎯"

                  if (habit.percentage === 100) {
                    variant = "default"
                    icon = "🏆"
                  } else if (habit.percentage < 40) {
                    variant = "destructive"
                    icon = "⚠️"
                  } else if (habit.percentage < 75) {
                    variant = "outline"
                    icon = "📊"
                  }

                  return (
                    <Badge 
                      key={habit.habitId} 
                      variant={variant} 
                      className="whitespace-nowrap"
                    >
                      {icon} {habit.name} — {habit.percentage}%
                    </Badge>
                  )
                })}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <MoodTrendChart data={weekStats.data.moodTrend} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
