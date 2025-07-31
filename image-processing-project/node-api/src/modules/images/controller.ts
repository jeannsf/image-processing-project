import { FastifyReply, FastifyRequest } from 'fastify'
import { imageService } from './service'
import type { ProcessImageResponse, ErrorResponse } from './types'

async function processImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file()

  if (!file) {
    const errorResponse: ErrorResponse = { message: 'No file provided' }
    return reply.status(400).send(errorResponse)
  }

  try {
    const result: ProcessImageResponse = await imageService.process(file)
    return reply.send(result)
  } catch (error) {
    const errorResponse: ErrorResponse = { message: 'Processing failed', error }
    return reply.status(500).send(errorResponse)
  }
}

export const imageController = {
  processImage,
}
