'use client'

import { useState }  from 'react'
import { Button }    from '@/components/ui/button'
import { Input }     from '@/components/ui/input'
import { Label }     from '@/components/ui/label'

const CATEGORIES = [
  { value: 'SLEEP',     label: '😴 Sueño'           },
  { value: 'EXERCISE',  label: '🏃 Ejercicio'        },
  { value: 'NUTRITION', label: '🥗 Nutrición'        },
  { value: 'BREAKS',    label: '☕ Pausas activas'   },
  { value: 'SOCIAL',    label: '🤝 Social'           },
  { value: 'OTHER',     label: '✨ Otro'             },
]

interface HabitFormProps {
  onSave: (name: string, category: string) => Promise<void>
  loading?: boolean
}

export function HabitForm({ onSave, loading }: HabitFormProps) {
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('SLEEP')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await onSave(name.trim(), category)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="habit-name">Nombre del hábito</Label>
        <Input
          id="habit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Dormir 8 horas"
          maxLength={100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="habit-category">Categoría</Label>
        <select
          id="habit-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Guardando...' : 'Agregar hábito'}
      </Button>
    </form>
  )
}
