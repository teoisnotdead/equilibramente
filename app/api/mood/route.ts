import { auth }             from '@/lib/auth'
import { moodService }      from '@/lib/services/mood.service'
import { logger }           from '@/lib/logger'
import { createMoodSchema } from '@/lib/validations/mood.schema'
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

    const { searchParams } = new URL(req.url)
    const period    = searchParams.get('period') as 'week' | 'month' | null
    const fromParam = searchParams.get('from')
    const toParam   = searchParams.get('to')

    const result = fromParam && toParam
      ? await moodService.getByDateRange(session.user.id, new Date(fromParam), new Date(toParam))
      : await moodService.getByPeriod(session.user.id, period === 'month' ? 'month' : 'week')

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data })
  } catch (err) {
    logger.error({ err }, 'GET /api/mood failed')
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
    const parsed = createMoodSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos inválidos', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await moodService.upsertToday(session.user.id, parsed.data)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data }, { status: 201 })
  } catch (err) {
    logger.error({ err }, 'POST /api/mood failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
