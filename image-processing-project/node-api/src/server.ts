import 'dotenv/config'
import { buildApp } from './app'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

async function startServer() {
  const app = buildApp()

  try {
    await app.listen({ port: PORT })
    app.log.info(` Server listening on port ${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()
