export enum DomainError {
  // Genéricos
  INTERNAL          = 'INTERNAL',
  UNAUTHORIZED      = 'UNAUTHORIZED',
  FORBIDDEN         = 'FORBIDDEN',

  // Auth
  AUTH_EMAIL_EXISTS = 'AUTH_EMAIL_EXISTS',
  AUTH_REGISTER_FAILED = 'AUTH_REGISTER_FAILED',

  // Mood
  MOOD_NOT_FOUND    = 'MOOD_NOT_FOUND',
  MOOD_SAVE_FAILED  = 'MOOD_SAVE_FAILED',
  MOOD_DELETE_FAILED = 'MOOD_DELETE_FAILED',
  MOOD_FETCH_FAILED = 'MOOD_FETCH_FAILED',

  // Habits (se usarán en Fase 4)
  HABIT_NOT_FOUND       = 'HABIT_NOT_FOUND',
  HABIT_SAVE_FAILED     = 'HABIT_SAVE_FAILED',
  HABIT_DELETE_FAILED   = 'HABIT_DELETE_FAILED',
  HABIT_LOG_SAVE_FAILED = 'HABIT_LOG_SAVE_FAILED',
  HABIT_FETCH_FAILED    = 'HABIT_FETCH_FAILED',

  // Stats
  STATS_FETCH_FAILED    = 'STATS_FETCH_FAILED',
}

// Mensajes legibles para el usuario final
export const DomainErrorMessage: Record<DomainError, string> = {
  [DomainError.INTERNAL]:            'Error interno del servidor',
  [DomainError.UNAUTHORIZED]:        'No autenticado',
  [DomainError.FORBIDDEN]:           'No autorizado',

  // Auth
  [DomainError.AUTH_EMAIL_EXISTS]:   'El correo ya está registrado',
  [DomainError.AUTH_REGISTER_FAILED]: 'Error interno al registrar usuario',

  [DomainError.MOOD_NOT_FOUND]:      'Registro de ánimo no encontrado',
  [DomainError.MOOD_SAVE_FAILED]:    'Error al guardar el estado de ánimo',
  [DomainError.MOOD_DELETE_FAILED]:  'Error al eliminar el registro',
  [DomainError.MOOD_FETCH_FAILED]:   'Error al obtener el historial',

  [DomainError.HABIT_NOT_FOUND]:       'Hábito no encontrado',
  [DomainError.HABIT_SAVE_FAILED]:     'Error al guardar el hábito',
  [DomainError.HABIT_DELETE_FAILED]:   'Error al eliminar el hábito',
  [DomainError.HABIT_LOG_SAVE_FAILED]: 'Error al registrar el hábito',
  [DomainError.HABIT_FETCH_FAILED]:    'Error al obtener los hábitos',

  // Stats
  [DomainError.STATS_FETCH_FAILED]:    'Error al obtener las estadísticas',
}

// Mapeo de DomainError a HTTP status code
export const DomainErrorStatus: Partial<Record<DomainError, number>> = {
  [DomainError.UNAUTHORIZED]:      401,
  [DomainError.FORBIDDEN]:         403,
  [DomainError.AUTH_EMAIL_EXISTS]: 409,
  [DomainError.MOOD_NOT_FOUND]:    404,
  [DomainError.HABIT_NOT_FOUND]:   404,
}

// Helper para obtener el status HTTP de un error de dominio
export function getHttpStatus(error: DomainError): number {
  return DomainErrorStatus[error] ?? 500
}
