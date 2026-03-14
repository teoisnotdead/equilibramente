'use client'

import { useState }   from 'react'
import { useRouter }  from 'next/navigation'
import { HabitForm }  from './HabitForm'
import { Button }     from '@/components/ui/button'
import { Badge }      from '@/components/ui/badge'
import type { Habit } from '@prisma/client'

interface HabitsManagerProps {
  habits: Habit[]
}

const CATEGORY_LABELS: Record<string, string> = {
  SLEEP:     '😴 Sueño',
  EXERCISE:  '🏃 Ejercicio',
  NUTRITION: '🥗 Nutrición',
  BREAKS:    '☕ Pausas',
  SOCIAL:    '🤝 Social',
  OTHER:     '✨ Otro',
}

export function HabitsManager({ habits }: HabitsManagerProps) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate(name: string, category: string) {
    setLoading(true)
    await fetch('/api/habits', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, category }),
    })
    setLoading(false)
    router.refresh()
  }

  async function handleDeactivate(habitId: string) {
    await fetch(`/api/habits/${habitId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <HabitForm onSave={handleCreate} loading={loading} />

      {habits.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Hábitos activos</p>
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{habit.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_LABELS[habit.category] ?? habit.category}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeactivate(habit.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
