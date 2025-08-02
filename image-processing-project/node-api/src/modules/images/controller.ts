import { FastifyReply, FastifyRequest } from "fastify";
import { imageService } from "./service";
import type {
  ProcessImageResponse,
  ErrorResponse,
  SaveChromaResponse,
  BackgroundDownloadResponse,
} from "./types";

async function processImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    const errorResponse: ErrorResponse = { message: "No file provided" };
    return reply.status(400).send(errorResponse);
  }

  try {
    const result: ProcessImageResponse = await imageService.process(file);
    return reply.send(result);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Processing failed",
      error,
    };
    return reply.status(500).send(errorResponse);
  }
}

async function uploadChroma(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    const errorResponse: ErrorResponse = { message: "No file provided" };
    return reply.status(400).send(errorResponse);
  }

  try {
    const result: SaveChromaResponse = await imageService.saveChroma(file);
    return reply.send(result);
  } catch (error) {
    const errorResponse: ErrorResponse = { message: "Upload failed", error };
    return reply.status(500).send(errorResponse);
  }
}

async function fetchAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const result: BackgroundDownloadResponse = await imageService.fetchAndSaveBackgrounds()
    return reply.send(result)
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: 'Failed to download backgrounds',
      error,
    }
    return reply.status(500).send(errorResponse)
  }
}


export const imageController = {
  processImage,
  uploadChroma,
  fetchAll,
};
