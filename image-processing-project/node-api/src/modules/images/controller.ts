import { FastifyReply, FastifyRequest } from "fastify";
import { imageService } from "./service";
import type {
  ErrorResponse,
  BackgroundDownloadResponse,
  BackgroundListResponse,
  ChromaDownloadResponse,
  ChromaListResponse,
} from "./types";

interface DeleteImageBody {
  filename: string;
  location: "chroma" | "backgrounds" | "processed";
}

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

async function fetchAllChroma(request: FastifyRequest, reply: FastifyReply) {
  try {
    const result: ChromaDownloadResponse =
      await imageService.fetchAndSaveChromas();
    return reply.send(result);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Failed to download chromas",
      error,
    };
    return reply.status(500).send(errorResponse);
  }
}

async function listChroma(request: FastifyRequest, reply: FastifyReply) {
  try {
    const chromas = await imageService.listChromas();
    const response: ChromaListResponse = {
      message: "Chromas fetched successfully",
      chromas,
    };
    return reply.send(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: "Failed to fetch chromas",
      error,
    };
    return reply.status(500).send(errorResponse);
  }
}

async function fetchAllProcessed(request: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await imageService.fetchAndSaveProcessed();
    return reply.send(result);
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to download processed images",
      error,
    });
  }
}

async function listProcessed(request: FastifyRequest, reply: FastifyReply) {
  try {
    const processedImages = await imageService.listProcessed();
    return reply.send({
      message: "Processed images fetched successfully",
      processed: processedImages,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Failed to fetch processed images",
      error,
    });
  }
}

async function deleteImageHandler(
  request: FastifyRequest<{ Body: DeleteImageBody }>,
  reply: FastifyReply
) {
  const { filename, location } = request.body;

  try {
    await imageService.deleteImage(filename, location);
    reply.send({
      message: `File '${filename}' deleted from '${location}' successfully.`,
    });
  } catch (error: any) {
    reply
      .status(500)
      .send({ message: error.message || "Failed to delete image" });
  }
}

export const imageController = {
  fetchAll,
  list,
  fetchAllChroma,
  listChroma,
  fetchAllProcessed,
  listProcessed,
  deleteImageHandler,
};
