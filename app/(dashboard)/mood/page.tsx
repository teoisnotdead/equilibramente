import { auth }        from '@/lib/auth'
import { redirect }    from 'next/navigation'
import { moodService } from '@/lib/services/mood.service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DashboardMoodSection } from '@/components/mood/DashboardMoodSection'

export default async function MoodPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const today     = new Date().toISOString().split('T')[0]
  const todayMood = await moodService.getToday(session.user.id)

  return (
    <div className="space-y-6">
      <h1
        className="text-3xl font-normal"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Estado de ánimo
      </h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Registro de hoy</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('es-CL', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardMoodSection
            todayEntry={todayMood.data ?? null}
            today={today}
          />
        </CardContent>
      </Card>
    </div>
  )
}
