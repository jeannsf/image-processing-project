import { FastifyInstance } from "fastify";
import { imageController } from "./controller";
import { fileUploadSchema } from "../../utils/utils";

export default async function (app: FastifyInstance) {
  app.get('/backgrounds', imageController.fetchAll)
  app.get('/backgrounds/list', imageController.list)

}
