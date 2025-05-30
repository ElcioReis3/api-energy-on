import fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = fastify({ logger: true });

// Registro das rotas
const start = async () => {
  await app.register(routes);
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  const PORT = process.env.PORT || 3001;
  try {
    await app.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`🚀 Servidor rodando em na porta ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
