import { buildApp } from "./app";

async function start() {
  const app = buildApp();

  try {
    await app.listen({ port: 8000 });
    console.log("Server running at http://localhost:8000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
