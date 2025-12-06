import { FastifyInstance } from "fastify";

export default async function exampleRoutes(app: FastifyInstance) {
  app.get("/ping", async () => {
    return { message: "pong" };
  });

  app.post("/user", async (req, reply) => {
    const body = req.body;
    return {
      success: true,
      received: body,
    };
  });
}
