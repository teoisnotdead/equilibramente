import { registerSchema } from '@/lib/validations/auth.schema'
import { authService } from '@/lib/services/auth.service'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Datos inválidos', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await authService.register(parsed.data)

    if (result.error) {
      const status = result.error.includes('ya está registrado') ? 409 : 500
      return Response.json({ error: result.error }, { status })
    }

    return Response.json({ data: result.data }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'POST /api/auth/register failed')
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
