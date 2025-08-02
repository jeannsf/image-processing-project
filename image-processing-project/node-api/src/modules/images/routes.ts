import { FastifyInstance } from "fastify";
import { imageController } from "./controller";

export default async function (app: FastifyInstance) {
  app.get("/backgrounds", imageController.fetchAll);
  app.get("/backgrounds/list", imageController.list);
  app.get("/chromas", imageController.fetchAllChroma);
  app.get("/chromas/list", imageController.listChroma);
  app.get("/processed", imageController.fetchAllProcessed);
  app.get("/processed/list", imageController.listProcessed);
  app.delete("", imageController.deleteImageHandler);
}
