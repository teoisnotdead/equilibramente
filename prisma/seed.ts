import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import type { HabitCategory } from '@prisma/client'

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'test@equilibramente.cl' },
    update: {},
    create: {
      email: 'test@equilibramente.cl',
      name: 'Usuario Test',
      passwordHash,
    },
  })

  const habitData: { name: string; category: HabitCategory }[] = [
    { name: 'Dormir 8 horas', category: 'SLEEP' },
    { name: 'Ejercicio 30 min', category: 'EXERCISE' },
    { name: 'Pausa activa', category: 'BREAKS' },
  ]

  const habits = await Promise.all(
    habitData.map((h) =>
      prisma.habit.create({ data: { userId: user.id, ...h } })
    )
  )

  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    date.setHours(0, 0, 0, 0)

    await prisma.moodEntry.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: {},
      create: { userId: user.id, score: Math.ceil(Math.random() * 5), date },
    })

    for (const habit of habits) {
      await prisma.habitLog.upsert({
        where: { habitId_date: { habitId: habit.id, date } },
        update: {},
        create: { habitId: habit.id, date, completed: Math.random() > 0.3 },
      })
    }
  }

  console.log('✅ Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
