import { auth }        from '@/lib/auth'
import { moodService } from '@/lib/services/mood.service'
import { logger }      from '@/lib/logger'
import { DomainError, DomainErrorMessage, getHttpStatus } from '@/lib/errors'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json(
        { error: DomainErrorMessage[DomainError.UNAUTHORIZED] },
        { status: 401 }
      )
    }

    const { id } = await params
    const result = await moodService.delete(session.user.id, id)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: { deleted: true } })
  } catch (err) {
    logger.error({ err }, 'DELETE /api/mood/[id] failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
