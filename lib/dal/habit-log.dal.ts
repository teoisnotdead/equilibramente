import { prisma } from '@/lib/prisma'
import type { HabitLog } from '@prisma/client'

export const habitLogDal = {
  async upsert(data: {
    habitId:   string
    date:      Date
    completed: boolean
  }): Promise<HabitLog> {
    return prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: data.habitId,
          date:    data.date,
        },
      },
      update: { completed: data.completed },
      create: {
        habitId:   data.habitId,
        date:      data.date,
        completed: data.completed,
      },
    })
  },

  async findByHabitAndDateRange(
    habitId: string,
    from: Date,
    to: Date
  ): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: {
        habitId,
        date: { gte: from, lte: to },
      },
      orderBy: { date: 'asc' },
    })
  },

  async findByUserAndDateRange(
    userId: string,
    from: Date,
    to: Date
  ): Promise<(HabitLog & { habit: { name: string; category: string } })[]> {
    return prisma.habitLog.findMany({
      where: {
        habit: { userId },
        date:  { gte: from, lte: to },
      },
      include: {
        habit: { select: { name: true, category: true } },
      },
      orderBy: { date: 'asc' },
    })
  },

  async findTodayByUser(
    userId: string,
    date: Date
  ): Promise<(HabitLog & { habit: { id: string; name: string; category: string } })[]> {
    return prisma.habitLog.findMany({
      where: {
        habit: { userId, isActive: true },
        date,
      },
      include: {
        habit: { select: { id: true, name: true, category: true } },
      },
    })
  },
}
