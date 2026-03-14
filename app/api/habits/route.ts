import { auth }               from '@/lib/auth'
import { habitService }       from '@/lib/services/habit.service'
import { logger }             from '@/lib/logger'
import { createHabitSchema }  from '@/lib/validations/habit.schema'
import { DomainError, DomainErrorMessage, getHttpStatus } from '@/lib/errors'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json(
        { error: DomainErrorMessage[DomainError.UNAUTHORIZED] },
        { status: 401 }
      )
    }

    const result = await habitService.getAll(session.user.id)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data })
  } catch (err) {
    logger.error({ err }, 'GET /api/habits failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json(
        { error: DomainErrorMessage[DomainError.UNAUTHORIZED] },
        { status: 401 }
      )
    }

    const body   = await req.json()
    const parsed = createHabitSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos inválidos', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await habitService.create(session.user.id, parsed.data)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'POST /api/habits failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
