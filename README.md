# EquilibraMente

Plataforma web para el seguimiento del estado de ánimo y hábitos de autocuidado en adultos jóvenes.

Proyecto de Título — Ingeniería en Informática — IACC

## Stack

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 5
- **Autenticación**: NextAuth.js v5 (JWT)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Gráficos**: Recharts
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
