'use client'

import { useState } from 'react'
import { Button }   from '@/components/ui/button'

const MOOD_OPTIONS = [
  { score: 1, emoji: '😔', label: 'Muy mal'  },
  { score: 2, emoji: '😕', label: 'Mal'      },
  { score: 3, emoji: '😐', label: 'Regular'  },
  { score: 4, emoji: '🙂', label: 'Bien'     },
  { score: 5, emoji: '😄', label: 'Muy bien' },
] as const

interface MoodPickerProps {
  defaultScore?: number
  isEdit?:       boolean   // ← nueva prop
  onSave:        (score: number, note?: string) => Promise<void>
  loading?:      boolean
}

export function MoodPicker({ defaultScore, isEdit = false, onSave, loading }: MoodPickerProps) {
  const [selected, setSelected] = useState<number>(defaultScore ?? 0)
  const [note, setNote]         = useState('')

  async function handleSave() {
    if (!selected) return
    await onSave(selected, note.trim() || undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.score}
            onClick={() => setSelected(option.score)}
            className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
              selected === option.score
                ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                : 'bg-muted hover:bg-muted/70 text-foreground'
            }`}
          >
            <span className="text-3xl">{option.emoji}</span>
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {selected > 0 && (
        <div className="space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Algo que destacar de tu día? (opcional)"
            maxLength={500}
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full"
            variant={isEdit ? 'outline' : 'default'}
          >
            {loading
              ? (isEdit ? 'Actualizando...' : 'Guardando...')
              : (isEdit ? '✏️ Editar registro' : 'Guardar registro')}
          </Button>
        </div>
      )}
    </div>
  )
}
