import { prisma } from '@/lib/prisma'
import type { Habit, HabitCategory } from '@prisma/client'

export const habitDal = {
  async findAllByUser(userId: string): Promise<Habit[]> {
    return prisma.habit.findMany({
      where:   { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    })
  },

  async findById(id: string): Promise<Habit | null> {
    return prisma.habit.findUnique({ where: { id } })
  },

  async create(data: {
    userId:   string
    name:     string
    category: HabitCategory
  }): Promise<Habit> {
    return prisma.habit.create({ data })
  },

  async update(
    id: string,
    data: {
      name?:     string
      category?: HabitCategory
      isActive?: boolean
    }
  ): Promise<Habit> {
    return prisma.habit.update({ where: { id }, data })
  },

  async deactivate(id: string): Promise<Habit> {
    return prisma.habit.update({
      where: { id },
      data:  { isActive: false },
    })
  },
}
