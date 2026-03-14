import { statsService } from '@/lib/services/stats.service'
import { moodDal }      from '@/lib/dal/mood.dal'
import { habitDal }     from '@/lib/dal/habit.dal'
import { habitLogDal }  from '@/lib/dal/habit-log.dal'

// Mockear los DAL completos
jest.mock('@/lib/dal/mood.dal')
jest.mock('@/lib/dal/habit.dal')
jest.mock('@/lib/dal/habit-log.dal')
jest.mock('@/lib/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}))

const mockMoodDal     = jest.mocked(moodDal)
const mockHabitDal    = jest.mocked(habitDal)
const mockHabitLogDal = jest.mocked(habitLogDal)

describe('statsService.getStats', () => {
  const userId = 'user-test-123'

  beforeEach(() => jest.clearAllMocks())

  it('retorna moodAverage null cuando no hay registros de ánimo', async () => {
    mockMoodDal.findByUserAndDateRange.mockResolvedValue([])
    mockHabitDal.findAllByUser.mockResolvedValue([])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue([])

    const result = await statsService.getStats(userId, 'week')

    expect(result.error).toBeNull()
    expect(result.data?.moodAverage).toBeNull()
    expect(result.data?.moodTrend).toHaveLength(0)
  })

  it('calcula el promedio de ánimo correctamente', async () => {
    const mockEntries = [
      { id: '1', userId, score: 3, note: null, date: new Date('2025-01-10'), createdAt: new Date() },
      { id: '2', userId, score: 5, note: null, date: new Date('2025-01-11'), createdAt: new Date() },
      { id: '3', userId, score: 4, note: null, date: new Date('2025-01-12'), createdAt: new Date() },
    ]

    mockMoodDal.findByUserAndDateRange.mockResolvedValue(mockEntries)
    mockHabitDal.findAllByUser.mockResolvedValue([])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue([])

    const result = await statsService.getStats(userId, 'week')

    expect(result.error).toBeNull()
    expect(result.data?.moodAverage).toBe(4) // (3+5+4)/3 = 4
    expect(result.data?.moodTrend).toHaveLength(3)
  })

  it('calcula el porcentaje de cumplimiento de hábitos correctamente', async () => {
    const mockHabit = {
      id: 'habit-1', userId, name: 'Dormir 8 horas',
      category: 'SLEEP' as const, isActive: true, createdAt: new Date(),
    }

    const mockLogs = [
      { habitId: 'habit-1', completed: true  },
      { habitId: 'habit-1', completed: true  },
      { habitId: 'habit-1', completed: false },
    ]

    mockMoodDal.findByUserAndDateRange.mockResolvedValue([])
    mockHabitDal.findAllByUser.mockResolvedValue([mockHabit])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue(mockLogs as never)

    const result = await statsService.getStats(userId, 'week')

    expect(result.error).toBeNull()
    const compliance = result.data?.habitCompliance[0]
    expect(compliance?.completedDays).toBe(2)
    expect(compliance?.totalDays).toBe(7)
    expect(compliance?.percentage).toBe(28.6) // 2/7 = 28.57... → 28.6
  })

  it('retorna topHabit null cuando no hay hábitos', async () => {
    mockMoodDal.findByUserAndDateRange.mockResolvedValue([])
    mockHabitDal.findAllByUser.mockResolvedValue([])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue([])

    const result = await statsService.getStats(userId, 'week')

    expect(result.data?.topHabit).toBeNull()
  })

  it('identifica correctamente el topHabit con mayor porcentaje', async () => {
    const habits = [
      { id: 'h1', userId, name: 'Sueño',    category: 'SLEEP'    as const, isActive: true, createdAt: new Date() },
      { id: 'h2', userId, name: 'Ejercicio', category: 'EXERCISE' as const, isActive: true, createdAt: new Date() },
    ]

    const logs = [
      { habitId: 'h1', completed: true  },
      { habitId: 'h1', completed: true  },
      { habitId: 'h1', completed: true  },
      { habitId: 'h2', completed: true  },
    ]

    mockMoodDal.findByUserAndDateRange.mockResolvedValue([])
    mockHabitDal.findAllByUser.mockResolvedValue(habits)
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue(logs as never)

    const result = await statsService.getStats(userId, 'week')

    expect(result.data?.topHabit?.habitId).toBe('h1') // 3/7 > 1/7
  })

  it('retorna STATS_FETCH_FAILED cuando el DAL lanza error', async () => {
    mockMoodDal.findByUserAndDateRange.mockRejectedValue(new Error('DB error'))
    mockHabitDal.findAllByUser.mockResolvedValue([])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue([])

    const result = await statsService.getStats(userId, 'week')

    expect(result.data).toBeNull()
    expect(result.error).toBe('STATS_FETCH_FAILED')
  })

  it('retorna periodDays 7 para week y 30 para month', async () => {
    mockMoodDal.findByUserAndDateRange.mockResolvedValue([])
    mockHabitDal.findAllByUser.mockResolvedValue([])
    mockHabitLogDal.findByUserAndDateRange.mockResolvedValue([])

    const week  = await statsService.getStats(userId, 'week')
    const month = await statsService.getStats(userId, 'month')

    expect(week.data?.periodDays).toBe(7)
    expect(month.data?.periodDays).toBe(30)
  })
})
