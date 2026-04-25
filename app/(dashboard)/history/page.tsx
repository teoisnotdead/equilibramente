import { auth }         from '@/lib/auth'
import { redirect }     from 'next/navigation'
import { statsService } from '@/lib/services/stats.service'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { MoodTrendChart }          from '@/components/charts/MoodTrendChart'
import { HabitComplianceChart }    from '@/components/charts/HabitComplianceChart'
import { PeriodSelector }          from '@/components/layout/PeriodSelector'

interface HistoryPageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { period: periodParam } = await searchParams
  const period = periodParam === 'month' ? 'month' : 'week'

  const stats = await statsService.getStats(session.user.id, period)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-normal"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Historial
        </h1>
        <PeriodSelector current={period} />
      </div>

      {stats.data && (
        <>
          {/* Resumen numérico */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">
                  {stats.data.moodAverage ?? '—'}
                </p>
                <p className="text-sm text-muted-foreground">Promedio de ánimo</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">
                  {stats.data.moodTrend.length}
                </p>
                <p className="text-sm text-muted-foreground">Días registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">
                  {stats.data.topHabits && stats.data.topHabits.length > 0 
                    ? `${stats.data.topHabits[0].percentage}%` 
                    : '—'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.data.topHabits && stats.data.topHabits.length > 0 
                    ? (stats.data.topHabits.length === 1 
                        ? stats.data.topHabits[0].name 
                        : `Mejores hábitos (${stats.data.topHabits.length})`) 
                    : 'Mejor hábito'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de ánimo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tendencia de ánimo</CardTitle>
              <CardDescription>
                Últimos {stats.data.periodDays} días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodTrendChart data={stats.data.moodTrend} />
            </CardContent>
          </Card>

          {/* Gráfico de hábitos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cumplimiento de hábitos</CardTitle>
              <CardDescription>
                Porcentaje de días completados en el período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HabitComplianceChart data={stats.data.habitCompliance} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
