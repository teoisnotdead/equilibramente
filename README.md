# EquilibraMente

Plataforma web para el seguimiento del estado de ánimo y hábitos de autocuidado en adultos jóvenes.

Proyecto de Título — Ingeniería en Informática — IACC

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Base de datos**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 5
- **Autenticación**: NextAuth.js v5 (Auth.js)
- **UI**: Tailwind CSS v4 + shadcn/ui + Lucide React
- **Gráficos**: Recharts
- **Validaciones**: Zod
- **Logs**: Pino
- **Testing**: Jest + React Testing Library

## Requisitos previos

- Node.js 20+
- pnpm
- Docker (para PostgreSQL)

## Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd equilibramente
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Variables de entorno
Crear `.env` en la raíz:
```
DATABASE_URL="postgresql://postgres:123456@localhost:5432/equilibramenteapp?schema=public"
NEXTAUTH_SECRET="cambiar-en-produccion"
AUTH_URL="http://localhost:3000"
```

### 4. Levantar PostgreSQL con Docker
```bash
docker run --name equilibramente-app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=equilibramenteapp -p 5432:5432 -v pgdata_equilibra:/var/lib/postgresql/data -d postgres:16
```

### 5. Migrar la base de datos
```bash
npx prisma migrate dev
```

### 6. Cargar datos de demostración
```bash
npx prisma db seed
```
> **Nota**: Este comando limpia completamente la base de datos y genera 30 días de historial nuevo a partir de la fecha actual. Puedes ejecutarlo en cualquier momento para reiniciar los datos de demostración.

### 7. Iniciar el servidor
```bash
pnpm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

**Usuario demo**: demo@equilibramente.cl  
**Contraseña**: Demo1234!

## Comandos útiles

```bash
pnpm run dev          # Servidor de desarrollo
pnpm run build        # Build de producción
pnpm run test         # Ejecutar tests
pnpm run test:coverage # Cobertura de tests
npx prisma studio  # Explorador de base de datos
```

## Estructura del proyecto

```
equilibramente/
├── app/                  # Páginas y API routes (Next.js App Router)
│   ├── (auth)/           # Login y registro
│   ├── (dashboard)/      # Páginas protegidas
│   ├── (marketing)/      # Landing page pública
│   └── api/              # Endpoints REST
├── lib/
│   ├── dal/              # Data Access Layer (Prisma queries)
│   ├── services/         # Lógica de negocio
│   ├── validations/      # Schemas Zod
│   └── errors.ts         # Enum de errores de dominio
├── components/           # Componentes React
├── prisma/               # Schema y migraciones
└── __tests__/            # Tests unitarios
```

## Funcionalidades del MVP

- ✅ Registro e inicio de sesión
- ✅ Registro diario de estado de ánimo (escala 1–5)
- ✅ Registro de hábitos de autocuidado
- ✅ Historial semanal y mensual
- ✅ Gráficos de tendencias
- ✅ Pruebas unitarias (23 tests)

## Futuras funcionalidades / Mejoras (Roadmap)

- 📅 **Frecuencia específica para hábitos**: Poder definir qué días de la semana aplica un hábito (ej. "Entrenar" solo lunes, miércoles y viernes), y que el porcentaje de cumplimiento se calcule únicamente sobre esos días objetivo.
- 📊 **Vista detallada de correlación de hábitos**: Mostrar una lista completa de todos los hábitos y su porcentaje de cumplimiento junto al gráfico de tendencia de ánimo semanal. Esto permitirá identificar fácilmente si una baja en el ánimo está directamente relacionada con qué hábitos específicos se dejaron de cumplir.
- 📈 **Histórico extendido (Suscripción Premium)**: Permitir a los usuarios visualizar datos históricos más allá de los últimos 30 días actuales (ej. 3 meses, 6 meses o anual). Esto podría implementarse como una funcionalidad exclusiva para cuentas de pago, manteniendo los 30 días para las cuentas "Free" por defecto.
- 🔒 **Límite de Hábitos (Suscripción Premium)**: Establecer un máximo de 7 hábitos activos para los usuarios del plan gratuito. Los usuarios que deseen registrar y dar seguimiento a una cantidad ilimitada de hábitos podrán hacerlo adquiriendo el plan Premium.
- 🤖 **Insights y Correlaciones con IA (Suscripción Premium)**: Entregar reportes inteligentes que crucen datos. Ej: *"Notamos que los días que no cumples 'Dormir 7-8 horas', tu ánimo baja un 30% al día siguiente"*.
- 📄 **Exportación de Reportes Médicos/Personales (Suscripción Premium)**: Capacidad de exportar el historial de ánimo y hábitos en PDF o Excel, ideal para llevar a terapia o consultas médicas.
- 🔔 **Notificaciones Inteligentes y por Hábito (Suscripción Premium)**: Mientras que los usuarios *Free* reciben un (1) recordatorio general diario (ej. "No olvides registrar tu día"), los usuarios *Premium* podrán configurar múltiples alarmas específicas por hábito a horas exactas (ej. "Practicar piano a las 19:00 hrs").
