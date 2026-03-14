import { auth }                  from '@/lib/auth'
import { habitService }          from '@/lib/services/habit.service'
import { logger }                from '@/lib/logger'
import { createHabitLogSchema }  from '@/lib/validations/habit.schema'
import { DomainError, DomainErrorMessage, getHttpStatus } from '@/lib/errors'

// GET /api/habit-logs?period=week|month  o  today=true
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json(
        { error: DomainErrorMessage[DomainError.UNAUTHORIZED] },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const today  = searchParams.get('today')
    const period = searchParams.get('period') as 'week' | 'month' | null

    const result = today === 'true'
      ? await habitService.getTodayLogs(session.user.id)
      : await habitService.getLogsForPeriod(
          session.user.id,
          period === 'month' ? 'month' : 'week'
        )

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data })
  } catch (err) {
    logger.error({ err }, 'GET /api/habit-logs failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}

// POST /api/habit-logs — registrar cumplimiento de un hábito
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
    const parsed = createHabitLogSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos inválidos', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await habitService.logHabit(session.user.id, parsed.data)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'POST /api/habit-logs failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
