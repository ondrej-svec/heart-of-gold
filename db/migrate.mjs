// Apply all SQL migrations in db/migrations over HTTPS via the Neon serverless
// driver — no psql / libpq needed. Run with: `bun run db:migrate`
// (reads DATABASE_URL from the environment / .env.local).
import { neon } from '@neondatabase/serverless'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const sql = neon(url)
const dir = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

for (const file of files) {
  const raw = readFileSync(join(dir, file), 'utf8')
  // Drop whole-line comments, then split into individual statements.
  const statements = raw
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await sql.query(statement)
  }
  console.log(`✓ applied ${file} (${statements.length} statements)`)
}

console.log('Migrations complete.')
