import { z } from 'zod'

export const createMoodSchema = z.object({
  score: z.number().int().min(1).max(5),
  note:  z.string().max(500).optional(),
  date:  z.coerce.date(),
})

export const updateMoodSchema = createMoodSchema.partial()

export type CreateMoodDto = z.infer<typeof createMoodSchema>
export type UpdateMoodDto = z.infer<typeof updateMoodSchema>
