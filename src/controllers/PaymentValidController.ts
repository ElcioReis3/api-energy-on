import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

// Instanciando o Prisma Client
export const prisma = new PrismaClient();

export async function paymentValidController(fastify: FastifyInstance) {
  // 1️⃣Atualiza o status
  fastify.post("/webhook", async (request, reply) => {
    const { payment_id, status } = request.body as {
      payment_id: string;
      status: string;
    };
    if (!payment_id || !status) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    if (status === "approved") {
      await prisma.cobrance.update({
        where: { id: payment_id },
        data: { status: "PAGO" },
      });
    }

    return reply.send({ message: "Pagamento registrado" });
  });
  // 2️⃣ Atualizar pagamento para "usado" quando o plano for ativado
  fastify.put("/activate/:payment_id", async (request, reply) => {
    const { payment_id } = request.params as { payment_id: string };

    if (!payment_id) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }

    // Atualizar para "usado"
    await prisma.cobrance.update({
      where: { id: payment_id },
      data: { status: "PAGO" },
    });

    return reply.send({ message: "Plano ativado com sucesso!" });
  });
}
