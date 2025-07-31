import Fastify, { FastifyInstance } from "fastify";
import autoload from "@fastify/autoload";
import { join } from "path";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyMultipart from "@fastify/multipart";

export function buildFastifyApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
              },
            }
          : undefined,
    },
  });

  app.register(fastifyMultipart);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Image Processing API",
        version: "1.0.0",
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  app.register(autoload, {
    dir: join(__dirname, "..", "plugins"),
    options: { prefix: "" },
    ignorePattern: /swagger/,
  });

  app.register(autoload, {
    dir: join(__dirname, "..", "modules"),
  });

  return app;
}