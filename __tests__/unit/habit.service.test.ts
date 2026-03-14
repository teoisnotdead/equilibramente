import { habitService } from '@/lib/services/habit.service'
import { habitDal }     from '@/lib/dal/habit.dal'
import { habitLogDal }  from '@/lib/dal/habit-log.dal'
import { DomainError }  from '@/lib/errors'

jest.mock('@/lib/dal/habit.dal')
jest.mock('@/lib/dal/habit-log.dal')
jest.mock('@/lib/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}))

const mockHabitDal    = jest.mocked(habitDal)
const mockHabitLogDal = jest.mocked(habitLogDal)

describe('habitService', () => {
  const userId  = 'user-test-123'
  const habitId = 'habit-test-456'

  beforeEach(() => jest.clearAllMocks())

  describe('deactivate', () => {
    it('desactiva el hábito cuando el userId coincide', async () => {
      mockHabitDal.findById.mockResolvedValue({
        id: habitId, userId, name: 'Test', category: 'SLEEP',
        isActive: true, createdAt: new Date(),
      })
      mockHabitDal.deactivate.mockResolvedValue({
        id: habitId, userId, name: 'Test', category: 'SLEEP',
        isActive: false, createdAt: new Date(),
      })

      const result = await habitService.deactivate(userId, habitId)

      expect(result.error).toBeNull()
      expect(result.data).toBe(true)
      expect(mockHabitDal.deactivate).toHaveBeenCalledWith(habitId)
    })

    it('retorna FORBIDDEN cuando el userId no coincide', async () => {
      mockHabitDal.findById.mockResolvedValue({
        id: habitId, userId: 'otro-usuario', name: 'Test',
        category: 'SLEEP', isActive: true, createdAt: new Date(),
      })

      const result = await habitService.deactivate(userId, habitId)

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.FORBIDDEN)
      expect(mockHabitDal.deactivate).not.toHaveBeenCalled()
    })

    it('retorna HABIT_NOT_FOUND cuando no existe el hábito', async () => {
      mockHabitDal.findById.mockResolvedValue(null)

      const result = await habitService.deactivate(userId, habitId)

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.HABIT_NOT_FOUND)
    })
  })

  describe('logHabit', () => {
    it('registra el log correctamente', async () => {
      mockHabitDal.findById.mockResolvedValue({
        id: habitId, userId, name: 'Test', category: 'SLEEP',
        isActive: true, createdAt: new Date(),
      })
      const mockLog = {
        id: 'log-1', habitId, date: new Date('2025-01-15'),
        completed: true, createdAt: new Date(),
      }
      mockHabitLogDal.upsert.mockResolvedValue(mockLog)

      const result = await habitService.logHabit(userId, {
        habitId,
        date:      new Date('2025-01-15'),
        completed: true,
      })

      expect(result.error).toBeNull()
      expect(result.data?.completed).toBe(true)
    })

    it('retorna FORBIDDEN al loguear hábito ajeno', async () => {
      mockHabitDal.findById.mockResolvedValue({
        id: habitId, userId: 'otro-usuario', name: 'Test',
        category: 'SLEEP', isActive: true, createdAt: new Date(),
      })

      const result = await habitService.logHabit(userId, {
        habitId,
        date:      new Date(),
        completed: true,
      })

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.FORBIDDEN)
    })
  })
})
