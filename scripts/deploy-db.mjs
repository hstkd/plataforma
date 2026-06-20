import { execSync } from 'node:child_process'

// =====================================================================
// Paso de despliegue: aplica el esquema y siembra datos SOLO si la app
// está en modo Prisma con base de datos configurada. En modo demo (mock)
// no hace nada, así que el build sigue funcionando sin base de datos.
// Se ejecuta desde el script `vercel-build`.
// =====================================================================

const usePrisma = process.env.DATA_DRIVER === 'prisma' && !!process.env.DATABASE_URL

if (!usePrisma) {
  console.log('[deploy-db] Modo demo (sin DATA_DRIVER=prisma o sin DATABASE_URL). Omito push/seed.')
  process.exit(0)
}

try {
  console.log('[deploy-db] Aplicando esquema: prisma db push…')
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })

  console.log('[deploy-db] Sembrando datos demo: prisma db seed…')
  execSync('npx prisma db seed', { stdio: 'inherit' })

  console.log('[deploy-db] Base de datos lista. ✅')
} catch (err) {
  console.error('[deploy-db] Falló la preparación de la base de datos:', err.message)
  process.exit(1)
}
