import { habitDal }    from '@/lib/dal/habit.dal'
import { habitLogDal } from '@/lib/dal/habit-log.dal'
import { logger }      from '@/lib/logger'
import { DomainError } from '@/lib/errors'
import type { ServiceResult } from '@/types'
import type { Habit, HabitLog } from '@prisma/client'
import type {
  CreateHabitDto,
  UpdateHabitDto,
  CreateHabitLogDto,
} from '@/lib/validations/habit.schema'

function normalizeDate(date: Date): Date {
  return new Date(date.toISOString().split('T')[0])
}

function getDateRange(period: 'week' | 'month'): { from: Date; to: Date } {
  const to   = normalizeDate(new Date())
  const from = normalizeDate(new Date())
  from.setDate(from.getDate() - (period === 'month' ? 29 : 6))
  return { from, to }
}

export const habitService = {
  async getAll(userId: string): Promise<ServiceResult<Habit[]>> {
    try {
      const habits = await habitDal.findAllByUser(userId)
      return { data: habits, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'habitService.getAll failed')
      return { data: null, error: DomainError.HABIT_FETCH_FAILED }
    }
  },

  async create(
    userId: string,
    dto: CreateHabitDto
  ): Promise<ServiceResult<Habit>> {
    try {
      const habit = await habitDal.create({ userId, ...dto })
      logger.info({ userId, habitId: habit.id }, 'habit.create')
      return { data: habit, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'habitService.create failed')
      return { data: null, error: DomainError.HABIT_SAVE_FAILED }
    }
  },

  async update(
    userId: string,
    habitId: string,
    dto: UpdateHabitDto
  ): Promise<ServiceResult<Habit>> {
    try {
      const habit = await habitDal.findById(habitId)

      if (!habit) {
        return { data: null, error: DomainError.HABIT_NOT_FOUND }
      }

      if (habit.userId !== userId) {
        logger.warn({ userId, habitId }, 'habit.update: intento de editar hábito ajeno')
        return { data: null, error: DomainError.FORBIDDEN }
      }

      const updated = await habitDal.update(habitId, dto)
      logger.info({ userId, habitId }, 'habit.update')
      return { data: updated, error: null }
    } catch (err) {
      logger.error({ err, userId, habitId }, 'habitService.update failed')
      return { data: null, error: DomainError.HABIT_SAVE_FAILED }
    }
  },

  async deactivate(
    userId: string,
    habitId: string
  ): Promise<ServiceResult<true>> {
    try {
      const habit = await habitDal.findById(habitId)

      if (!habit) {
        return { data: null, error: DomainError.HABIT_NOT_FOUND }
      }

      if (habit.userId !== userId) {
        logger.warn({ userId, habitId }, 'habit.deactivate: intento de desactivar hábito ajeno')
        return { data: null, error: DomainError.FORBIDDEN }
      }

      await habitDal.deactivate(habitId)
      logger.info({ userId, habitId }, 'habit.deactivate')
      return { data: true, error: null }
    } catch (err) {
      logger.error({ err, userId, habitId }, 'habitService.deactivate failed')
      return { data: null, error: DomainError.HABIT_DELETE_FAILED }
    }
  },

  async logHabit(
    userId: string,
    dto: CreateHabitLogDto
  ): Promise<ServiceResult<HabitLog>> {
    try {
      // Verificar que el hábito pertenece al usuario
      const habit = await habitDal.findById(dto.habitId)

      if (!habit) {
        return { data: null, error: DomainError.HABIT_NOT_FOUND }
      }

      if (habit.userId !== userId) {
        logger.warn({ userId, habitId: dto.habitId }, 'habitLog: intento de loguear hábito ajeno')
        return { data: null, error: DomainError.FORBIDDEN }
      }

      const date = normalizeDate(dto.date)
      const log  = await habitLogDal.upsert({
        habitId:   dto.habitId,
        date,
        completed: dto.completed,
      })

      logger.info({ userId, habitId: dto.habitId, completed: dto.completed }, 'habit.log')
      return { data: log, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'habitService.logHabit failed')
      return { data: null, error: DomainError.HABIT_LOG_SAVE_FAILED }
    }
  },

  async getLogsForPeriod(
    userId: string,
    period: 'week' | 'month'
  ): Promise<ServiceResult<(HabitLog & { habit: { name: string; category: string } })[]>> {
    try {
      const { from, to } = getDateRange(period)
      const logs = await habitLogDal.findByUserAndDateRange(userId, from, to)
      return { data: logs, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'habitService.getLogsForPeriod failed')
      return { data: null, error: DomainError.HABIT_FETCH_FAILED }
    }
  },

  async getTodayLogs(
    userId: string
  ): Promise<ServiceResult<(HabitLog & { habit: { id: string; name: string; category: string } })[]>> {
    try {
      const today = normalizeDate(new Date())
      const logs  = await habitLogDal.findTodayByUser(userId, today)
      return { data: logs, error: null }
    } catch (err) {
      logger.error({ err, userId }, 'habitService.getTodayLogs failed')
      return { data: null, error: DomainError.HABIT_FETCH_FAILED }
    }
  },
}
