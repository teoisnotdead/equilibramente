import { prisma } from '@/lib/prisma'
import type { MoodEntry } from '@prisma/client'

export const moodDal = {
  async upsert(data: {
    userId: string
    score: number
    note?: string
    date: Date
  }): Promise<MoodEntry> {
    return prisma.moodEntry.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date:   data.date,
        },
      },
      update: {
        score: data.score,
        note:  data.note ?? null,
      },
      create: {
        userId: data.userId,
        score:  data.score,
        note:   data.note,
        date:   data.date,
      },
    })
  },

  async findById(id: string): Promise<MoodEntry | null> {
    return prisma.moodEntry.findUnique({ where: { id } })
  },

  async findByUserAndDateRange(
    userId: string,
    from: Date,
    to: Date
  ): Promise<MoodEntry[]> {
    return prisma.moodEntry.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      orderBy: { date: 'asc' },
    })
  },

  async findTodayByUser(userId: string, today: Date): Promise<MoodEntry | null> {
    return prisma.moodEntry.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    })
  },

  async delete(id: string): Promise<void> {
    await prisma.moodEntry.delete({ where: { id } })
  },
}
