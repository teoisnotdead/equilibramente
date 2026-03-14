import { moodDal }       from '@/lib/dal/mood.dal'
import { logger }        from '@/lib/logger'
import { DomainError }   from '@/lib/errors'
import type { ServiceResult } from '@/types'
import type { MoodEntry }     from '@prisma/client'
import type { CreateMoodDto } from '@/lib/validations/mood.schema'

function normalizeDate(date: Date): Date {
  return new Date(date.toISOString().split('T')[0])
}

function getDateRange(period: 'week' | 'month'): { from: Date; to: Date } {
  const to   = normalizeDate(new Date())
  const from = normalizeDate(new Date())
  from.setDate(from.getDate() - (period === 'month' ? 29 : 6))
  return { from, to }
}

export const moodService = {
  async upsertToday(
    userId: string,
    dto: CreateMoodDto
  ): Promise<ServiceResult<MoodEntry>> {
    try {
      const date  = normalizeDate(dto.date)
      const entry = await moodDal.upsert({ userId, score: dto.score, note: dto.note, date })
      logger.info({ userId, date: date.toISOString(), score: dto.score }, 'mood.upsert')
      return { data: entry, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'moodService.upsertToday failed')
      return { data: null, error: DomainError.MOOD_SAVE_FAILED }
    }
  },

  async getByPeriod(
    userId: string,
    period: 'week' | 'month'
  ): Promise<ServiceResult<MoodEntry[]>> {
    try {
      const { from, to } = getDateRange(period)
      const entries = await moodDal.findByUserAndDateRange(userId, from, to)
      return { data: entries, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'moodService.getByPeriod failed')
      return { data: null, error: DomainError.MOOD_FETCH_FAILED }
    }
  },

  async getByDateRange(
    userId: string,
    from: Date,
    to: Date
  ): Promise<ServiceResult<MoodEntry[]>> {
    try {
      const entries = await moodDal.findByUserAndDateRange(
        userId,
        normalizeDate(from),
        normalizeDate(to)
      )
      return { data: entries, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'moodService.getByDateRange failed')
      return { data: null, error: DomainError.MOOD_FETCH_FAILED }
    }
  },

  async getToday(userId: string): Promise<ServiceResult<MoodEntry | null>> {
    try {
      const today = normalizeDate(new Date())
      const entry = await moodDal.findTodayByUser(userId, today)
      return { data: entry, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'moodService.getToday failed')
      return { data: null, error: DomainError.MOOD_FETCH_FAILED }
    }
  },

  async delete(
    userId: string,
    entryId: string
  ): Promise<ServiceResult<true>> {
    try {
      const entry = await moodDal.findById(entryId)

      if (!entry) {
        return { data: null, error: DomainError.MOOD_NOT_FOUND }
      }

      if (entry.userId !== userId) {
        logger.warn({ userId, entryId }, 'mood.delete: intento de borrar entrada ajena')
        return { data: null, error: DomainError.FORBIDDEN }
      }

      await moodDal.delete(entryId)
      logger.info({ userId, entryId }, 'mood.delete')
      return { data: true, error: null }
    } catch (err) {
      logger.error({ err, userId, entryId }, 'moodService.delete failed')
      return { data: null, error: DomainError.MOOD_DELETE_FAILED }
    }
  },
}
