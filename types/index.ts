import type { User, MoodEntry, Habit, HabitLog, HabitCategory } from '@prisma/client'

// Re-exportar tipos generados por Prisma
export type { User, MoodEntry, Habit, HabitLog, HabitCategory }

// DTO público de usuario (nunca exponer passwordHash)
export type UserPublic = Omit<User, 'passwordHash'>

// Inputs tipados para la capa de services
export type CreateMoodInput = {
  score: number
  note?: string
  date: Date
}

export type CreateHabitInput = {
  name: string
  category: HabitCategory
}

export type UpdateHabitInput = {
  name?: string
  category?: HabitCategory
  isActive?: boolean
}

export type CreateHabitLogInput = {
  habitId: string
  date: Date
  completed: boolean
}

// Result pattern para services — nunca lanzar excepciones al route handler
export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }
