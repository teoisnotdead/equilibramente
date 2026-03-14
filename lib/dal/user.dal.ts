import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

export const userDal = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  async create(data: {
    email: string
    passwordHash: string
    name?: string
  }): Promise<User> {
    return prisma.user.create({ data })
  },
}
