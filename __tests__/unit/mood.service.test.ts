import { moodService } from '@/lib/services/mood.service'
import { moodDal }     from '@/lib/dal/mood.dal'
import { DomainError } from '@/lib/errors'

jest.mock('@/lib/dal/mood.dal')
jest.mock('@/lib/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}))

const mockMoodDal = jest.mocked(moodDal)

describe('moodService', () => {
  const userId = 'user-test-123'

  beforeEach(() => jest.clearAllMocks())

  describe('upsertToday', () => {
    it('crea un registro correctamente', async () => {
      const mockEntry = {
        id: 'entry-1', userId, score: 4, note: 'Buen día',
        date: new Date('2025-01-15'), createdAt: new Date(),
      }
      mockMoodDal.upsert.mockResolvedValue(mockEntry)

      const result = await moodService.upsertToday(userId, {
        score: 4,
        note:  'Buen día',
        date:  new Date('2025-01-15'),
      })

      expect(result.error).toBeNull()
      expect(result.data?.score).toBe(4)
      expect(result.data?.note).toBe('Buen día')
    })

    it('retorna MOOD_SAVE_FAILED cuando el DAL falla', async () => {
      mockMoodDal.upsert.mockRejectedValue(new Error('DB error'))

      const result = await moodService.upsertToday(userId, {
        score: 3,
        date:  new Date(),
      })

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.MOOD_SAVE_FAILED)
    })
  })

  describe('delete', () => {
    it('elimina correctamente cuando el userId coincide', async () => {
      mockMoodDal.findById.mockResolvedValue({
        id: 'entry-1', userId, score: 4, note: null,
        date: new Date(), createdAt: new Date(),
      })
      mockMoodDal.delete.mockResolvedValue(undefined)

      const result = await moodService.delete(userId, 'entry-1')

      expect(result.error).toBeNull()
      expect(result.data).toBe(true)
    })

    it('retorna MOOD_NOT_FOUND cuando no existe el registro', async () => {
      mockMoodDal.findById.mockResolvedValue(null)

      const result = await moodService.delete(userId, 'entry-inexistente')

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.MOOD_NOT_FOUND)
    })

    it('retorna FORBIDDEN cuando el userId no coincide', async () => {
      mockMoodDal.findById.mockResolvedValue({
        id: 'entry-1', userId: 'otro-usuario', score: 4,
        note: null, date: new Date(), createdAt: new Date(),
      })

      const result = await moodService.delete(userId, 'entry-1')

      expect(result.data).toBeNull()
      expect(result.error).toBe(DomainError.FORBIDDEN)
    })
  })
})
