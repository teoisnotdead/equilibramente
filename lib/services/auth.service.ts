import bcrypt from 'bcryptjs'
import { userDal } from '@/lib/dal/user.dal'
import { logger } from '@/lib/logger'
import type { ServiceResult, UserPublic } from '@/types'
import type { RegisterDto } from '@/lib/validations/auth.schema'
import { DomainError } from '@/lib/errors'

export const authService = {
  async register(dto: RegisterDto): Promise<ServiceResult<UserPublic>> {
    try {
      const existing = await userDal.findByEmail(dto.email)
      if (existing) {
        return { data: null, error: DomainError.AUTH_EMAIL_EXISTS }
      }

      const passwordHash = await bcrypt.hash(dto.password, 12)

      const user = await userDal.create({
        email: dto.email,
        passwordHash,
        name: dto.name,
      })

      logger.info({ userId: user.id }, 'Usuario registrado')

      const { passwordHash: _, ...userPublic } = user
      return { data: userPublic, error: null }
    } catch (err) {
      logger.error({ err }, 'authService.register failed')
      return { data: null, error: DomainError.AUTH_REGISTER_FAILED }
    }
  },

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<UserPublic | null> {
    try {
      const user = await userDal.findByEmail(email)
      if (!user) return null

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) return null

      const { passwordHash: _, ...userPublic } = user
      return userPublic
    } catch (err) {
      logger.error({ err }, 'authService.verifyCredentials failed')
      return null
    }
  },
}
