import { FastifyInstance } from "fastify";
import { imageController } from "./controller";
import { fileUploadSchema } from "../../utils/utils";

export default async function (app: FastifyInstance) {
  app.post(
    "/process",
    {
      schema: fileUploadSchema,
    },
    imageController.processImage
  );

  app.post(
    "/chroma",
    {
      schema: fileUploadSchema,
    },
    imageController.uploadChroma
  );

  app.get('/backgrounds', imageController.fetchAll)

}
