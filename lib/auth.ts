import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from '@/lib/validations/auth.schema'
import { authService } from '@/lib/services/auth.service'
import { logger } from '@/lib/logger'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          logger.warn('authorize: credenciales inválidas')
          return null
        }

        const user = await authService.verifyCredentials(
          parsed.data.email,
          parsed.data.password
        )

        if (!user) {
          logger.warn({ email: parsed.data.email }, 'authorize: credenciales incorrectas')
          return null
        }

        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? undefined,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
