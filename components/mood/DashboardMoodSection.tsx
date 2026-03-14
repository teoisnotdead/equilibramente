'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import { MoodPicker }  from './MoodPicker'
import type { MoodEntry } from '@prisma/client'

const MOOD_LABELS: Record<number, string> = {
  1: '😔 Muy mal',
  2: '😕 Mal',
  3: '😐 Regular',
  4: '🙂 Bien',
  5: '😄 Muy bien',
}

interface DashboardMoodSectionProps {
  todayEntry: MoodEntry | null
  today:      string
}

export function DashboardMoodSection({ todayEntry, today }: DashboardMoodSectionProps) {
  const router            = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(!todayEntry)

  async function handleSave(score: number, note?: string) {
    setLoading(true)
    await fetch('/api/mood', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ score, note, date: today }),
    })
    setLoading(false)
    setShowPicker(false)
    router.refresh()
  }

  // Ya hay registro y no está en modo edición
  if (todayEntry && !showPicker) {
    const emoji = MOOD_LABELS[todayEntry.score]?.split(' ')[0]
    const label = MOOD_LABELS[todayEntry.score]?.split(' ').slice(1).join(' ')

    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-5xl">{emoji}</p>
        <p className="text-lg font-medium">{label}</p>
        {todayEntry.note && (
          <p className="text-sm text-muted-foreground italic">"{todayEntry.note}"</p>
        )}
        <button
          onClick={() => setShowPicker(true)}
          className="text-xs text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          ✏️ Editar registro de hoy
        </button>
      </div>
    )
  }

  return (
    <MoodPicker
      defaultScore={todayEntry?.score}
      isEdit={!!todayEntry}
      onSave={handleSave}
      loading={loading}
    />
  )
}
