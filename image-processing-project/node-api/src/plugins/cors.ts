import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: true, 
  })
})
