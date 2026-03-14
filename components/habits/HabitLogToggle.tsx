'use client'

import { useState } from 'react'

interface HabitLogToggleProps {
  habitId:          string
  habitName:        string
  initialCompleted: boolean
  date:             string  // YYYY-MM-DD
  onToggle:         (habitId: string, completed: boolean) => Promise<void>
}

export function HabitLogToggle({
  habitId,
  habitName,
  initialCompleted,
  date,
  onToggle,
}: HabitLogToggleProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading]     = useState(false)

  async function handleToggle() {
    setLoading(true)
    const next = !completed
    setCompleted(next)
    try {
      await onToggle(habitId, next)
    } catch {
      setCompleted(!next) // revertir si falla
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 transition-all ${
        completed
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-muted/50'
      }`}
    >
      <span className="text-sm font-medium">{habitName}</span>
      <span className="text-lg">{completed ? '✅' : '⬜'}</span>
    </button>
  )
}
