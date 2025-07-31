import { FastifyInstance } from 'fastify'
import { imageController } from './controller'

export default async function (app: FastifyInstance) {
  app.post('/process', imageController.processImage)
}