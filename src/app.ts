import Fastify from "fastify";

export function buildApp() {
  const fastify = Fastify({ logger: true });

  // Register routes
  fastify.register(import("./routes/example.route"));

  return fastify;
}
