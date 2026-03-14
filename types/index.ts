import type { User, MoodEntry, Habit, HabitLog, HabitCategory } from '@prisma/client'
import type { DomainError } from '@/lib/errors'

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

// ServiceResult tipado con DomainError — nunca strings sueltos
export type ServiceResult<T> =
  | { data: T;    error: null }
  | { data: null; error: DomainError }
