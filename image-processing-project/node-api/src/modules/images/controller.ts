import { FastifyReply, FastifyRequest } from "fastify";
import { imageService } from "./service";
import type {
  ErrorResponse,
  BackgroundDownloadResponse,
  BackgroundListResponse,
} from "./types";

async function fetchAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const result: BackgroundDownloadResponse =
      await imageService.fetchAndSaveBackgrounds();
    return reply.send(result);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Failed to download backgrounds",
      error,
    };
    return reply.status(500).send(errorResponse);
  }
}

async function list(request: FastifyRequest, reply: FastifyReply) {
  try {
    const backgrounds = await imageService.listBackgrounds();
    const response: BackgroundListResponse = {
      message: "Backgrounds fetched successfully",
      backgrounds,
    };
    return reply.send(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Failed to fetch backgrounds",
      error,
    };
    return reply.status(500).send(errorResponse);
  }
}

export const imageController = {
  fetchAll,
  list,
};
