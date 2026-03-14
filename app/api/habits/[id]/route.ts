import { auth }               from '@/lib/auth'
import { habitService }       from '@/lib/services/habit.service'
import { logger }             from '@/lib/logger'
import { updateHabitSchema }  from '@/lib/validations/habit.schema'
import { DomainError, DomainErrorMessage, getHttpStatus } from '@/lib/errors'

export async function PUT(
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
    const body   = await req.json()
    const parsed = updateHabitSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Datos inválidos', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await habitService.update(session.user.id, id, parsed.data)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: result.data })
  } catch (err) {
    logger.error({ err }, 'PUT /api/habits/[id] failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}

// DELETE desactiva el hábito — nunca lo elimina físicamente
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
    const result = await habitService.deactivate(session.user.id, id)

    if (result.error) {
      return Response.json(
        { error: DomainErrorMessage[result.error] },
        { status: getHttpStatus(result.error) }
      )
    }

    return Response.json({ data: { deactivated: true } })
  } catch (err) {
    logger.error({ err }, 'DELETE /api/habits/[id] failed')
    return Response.json(
      { error: DomainErrorMessage[DomainError.INTERNAL] },
      { status: 500 }
    )
  }
}
