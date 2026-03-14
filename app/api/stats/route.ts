import { auth }          from '@/lib/auth'
import { statsService }  from '@/lib/services/stats.service'
import { logger }        from '@/lib/logger'
import { DomainError, DomainErrorMessage, getHttpStatus } from '@/lib/errors'

// GET /api/stats?period=week|month
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
    const period = searchParams.get('period') === 'month' ? 'month' : 'week'

    const result = await statsService.getStats(session.user.id, period)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data })
  } catch (err) {
    logger.error({ err }, 'GET /api/stats failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
