import { z } from 'zod'

export const habitCategorySchema = z.enum([
  'SLEEP',
  'EXERCISE',
  'NUTRITION',
  'BREAKS',
  'SOCIAL',
  'OTHER',
])

export const createHabitSchema = z.object({
  name:     z.string().min(1).max(100),
  category: habitCategorySchema,
})

export const updateHabitSchema = z.object({
  name:     z.string().min(1).max(100).optional(),
  category: habitCategorySchema.optional(),
  isActive: z.boolean().optional(),
})

export const createHabitLogSchema = z.object({
  habitId:   z.string().cuid(),
  date:      z.coerce.date(),
  completed: z.boolean(),
})

export type CreateHabitDto    = z.infer<typeof createHabitSchema>
export type UpdateHabitDto    = z.infer<typeof updateHabitSchema>
export type CreateHabitLogDto = z.infer<typeof createHabitLogSchema>
