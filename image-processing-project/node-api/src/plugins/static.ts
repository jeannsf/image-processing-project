import { FastifyPluginAsync } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

const staticPlugin: FastifyPluginAsync = async (app) => {
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, "../../src/data"),
    prefix: "/static/",
  });
};

export default staticPlugin;
