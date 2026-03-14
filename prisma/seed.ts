import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import type { HabitCategory } from '@prisma/client'

async function main() {
  console.log('🌱 Iniciando seed de demostración...')

  // Limpiar datos existentes del usuario demo
  const existing = await prisma.user.findUnique({
    where: { email: 'demo@equilibramente.cl' }
  })
  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } })
  }

  const passwordHash = await bcrypt.hash('Demo1234!', 12)

  const user = await prisma.user.create({
    data: {
      email:        'demo@equilibramente.cl',
      name:         'Valentina Muñoz',
      passwordHash,
    },
  })

  // Hábitos variados y realistas
  const habitData: { name: string; category: HabitCategory }[] = [
    { name: 'Dormir 7-8 horas',      category: 'SLEEP'     },
    { name: '30 min de ejercicio',   category: 'EXERCISE'  },
    { name: 'Desayuno saludable',    category: 'NUTRITION' },
    { name: 'Pausa activa en clases', category: 'BREAKS'   },
    { name: 'Llamar a un amigo',     category: 'SOCIAL'    },
  ]

  const habits = await Promise.all(
    habitData.map((h) => prisma.habit.create({ data: { userId: user.id, ...h } }))
  )

  // Patrones de ánimo realistas para 30 días
  // Semana 1: estrés inicial (scores bajos)
  // Semana 2-3: mejora gradual
  // Semana 4: estabilización
  const moodPattern = [
    2, 2, 3, 2, 3, 3, 4,  // semana 1 — estrés
    3, 4, 3, 4, 4, 3, 4,  // semana 2 — mejora
    4, 4, 5, 4, 3, 4, 5,  // semana 3 — buena racha
    4, 5, 4, 4, 5, 4, 5,  // semana 4 — estable
  ]

  // Notas opcionales para algunos días
  const notes: Record<number, string> = {
    0:  'Semana de exámenes, muy estresada',
    3:  'Mal día, no pude dormir bien',
    6:  'Fin de semana, me relajé un poco',
    10: 'Empecé a hacer ejercicio, me sentí mejor',
    16: '¡Mejor semana del mes!',
    24: 'Todo fluyendo bien',
    29: 'Cerrando el mes con energía',
  }

  // Patrones de cumplimiento por hábito (realistas, no perfectos)
  // [sueño, ejercicio, desayuno, pausas, social]
  const habitPatterns = [
    [1, 0, 1, 1, 0],  // día 1
    [1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1],  // día 7
    [1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 0, 1],  // día 14
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],  // día 21
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],  // día 30
  ]

  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayIndex = 29 - i

    // Registro de ánimo (todos los días excepto 2 aleatorios)
    if (dayIndex !== 8 && dayIndex !== 19) {
      await prisma.moodEntry.create({
        data: {
          userId: user.id,
          score:  moodPattern[dayIndex] ?? 3,
          note:   notes[dayIndex] ?? null,
          date,
        },
      })
    }

    // Logs de hábitos
    const pattern = habitPatterns[dayIndex]
    if (pattern) {
      await Promise.all(
        habits.map((habit, idx) =>
          prisma.habitLog.create({
            data: {
              habitId:   habit.id,
              date,
              completed: pattern[idx] === 1,
            },
          })
        )
      )
    }
  }

  console.log('✅ Seed completado')
  console.log('   Usuario demo: demo@equilibramente.cl')
  console.log('   Contraseña:   Demo1234!')
  console.log(`   Días de datos: 30`)
  console.log(`   Hábitos: ${habits.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
