import { FastifyInstance } from 'fastify'
import fastifyMultipart from '@fastify/multipart'

export async function multipartPlugin(app: FastifyInstance) {
  app.register(fastifyMultipart)
}
