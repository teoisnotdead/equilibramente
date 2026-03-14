'use client'

import { useRouter }       from 'next/navigation'
import { HabitLogToggle }  from './HabitLogToggle'
import type { HabitLog }   from '@prisma/client'

interface TodayLog {
  habitId:   string
  habitName: string
  category:  string
  completed: boolean
}

interface DashboardHabitsSectionProps {
  logs:  TodayLog[]
  today: string
}

export function DashboardHabitsSection({ logs, today }: DashboardHabitsSectionProps) {
  const router = useRouter()

  async function handleToggle(habitId: string, completed: boolean) {
    await fetch('/api/habit-logs', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ habitId, completed, date: today }),
    })
    router.refresh()
  }

  if (logs.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground">No tienes hábitos activos.</p>
        <a href="/habits" className="mt-2 inline-block text-sm text-primary underline">
          Agregar hábitos →
        </a>
      </div>
    )
  }

  const completed = logs.filter((l) => l.completed).length

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        {completed} de {logs.length} completados hoy
      </p>
      {logs.map((log) => (
        <HabitLogToggle
          key={log.habitId}
          habitId={log.habitId}
          habitName={log.habitName}
          initialCompleted={log.completed}
          date={today}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
