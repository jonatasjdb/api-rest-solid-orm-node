import 'dotenv/config'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'

// postgresql://docker:docker@localhost:5432/ignitenode03?schema=public

function generateDatabaseURL(schema: string) {
  if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>(<unknown>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
})
