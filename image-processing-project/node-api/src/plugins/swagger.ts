import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export default async function (app: FastifyInstance, opts: any) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Image Processing API',
        description: 'API para upload e processamento de imagens',
        version: '1.0.0',
      },
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  })
}