import { moodDal }     from '@/lib/dal/mood.dal'
import { habitDal }    from '@/lib/dal/habit.dal'
import { habitLogDal } from '@/lib/dal/habit-log.dal'
import { logger }      from '@/lib/logger'
import { DomainError } from '@/lib/errors'
import type { ServiceResult, StatsResult, MoodTrendPoint, HabitComplianceItem } from '@/types'

function normalizeDate(date: Date): Date {
  return new Date(date.toISOString().split('T')[0])
}

function getDateRange(period: 'week' | 'month'): { from: Date; to: Date; days: number } {
  const to   = normalizeDate(new Date())
  const from = normalizeDate(new Date())
  const days = period === 'month' ? 30 : 7
  from.setDate(from.getDate() - (days - 1))
  return { from, to, days }
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function calcMoodAverage(scores: number[]): number | null {
  if (scores.length === 0) return null
  const sum = scores.reduce((acc, s) => acc + s, 0)
  return Math.round((sum / scores.length) * 10) / 10
}

function calcHabitCompliance(
  habits: { id: string; name: string; category: string }[],
  logs: { habitId: string; completed: boolean }[],
  totalDays: number
): HabitComplianceItem[] {
  return habits.map((habit) => {
    const habitLogs      = logs.filter((l) => l.habitId === habit.id)
    const completedDays  = habitLogs.filter((l) => l.completed).length

    return {
      habitId:       habit.id,
      name:          habit.name,
      category:      habit.category,
      totalDays,
      completedDays,
      percentage:    totalDays > 0
        ? Math.round((completedDays / totalDays) * 1000) / 10
        : 0,
    }
  })
}

export const statsService = {
  async getStats(
    userId: string,
    period: 'week' | 'month'
  ): Promise<ServiceResult<StatsResult>> {
    try {
      const { from, to, days } = getDateRange(period)

      // Fetch en paralelo — no esperar uno para empezar el otro
      const [moodEntries, habits, habitLogs] = await Promise.all([
        moodDal.findByUserAndDateRange(userId, from, to),
        habitDal.findAllByUser(userId),
        habitLogDal.findByUserAndDateRange(userId, from, to),
      ])

      // Mood trend — un punto por día con registro
      const moodTrend: MoodTrendPoint[] = moodEntries.map((entry) => ({
        date:  toDateString(new Date(entry.date)),
        score: entry.score,
      }))

      // Mood average
      const moodAverage = calcMoodAverage(moodEntries.map((e) => e.score))

      // Habit compliance
      const habitCompliance = calcHabitCompliance(
        habits.map((h) => ({ id: h.id, name: h.name, category: h.category })),
        habitLogs.map((l) => ({ habitId: l.habitId, completed: l.completed })),
        days
      )

      // Top habits — encontrar el porcentaje máximo y filtrar todos los que lo tengan
      let topHabits: HabitComplianceItem[] = []
      if (habitCompliance.length > 0) {
        const maxPercentage = Math.max(...habitCompliance.map(h => h.percentage))
        // Solo consideraremos como "top" si al menos se ha cumplido algo (> 0%)
        if (maxPercentage > 0) {
          topHabits = habitCompliance.filter(h => h.percentage === maxPercentage)
        }
      }

      const result: StatsResult = {
        period,
        periodDays:      days,
        moodAverage,
        moodTrend,
        habitCompliance,
        topHabits,
      }

      logger.info({ userId, period, moodAverage }, 'stats.get')
      return { data: result, error: null }
    } catch (err) {
      logger.error({ err, userId, period }, 'statsService.getStats failed')
      return { data: null, error: DomainError.STATS_FETCH_FAILED }
    }
  },
}
