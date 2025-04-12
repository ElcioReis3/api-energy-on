import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../prisma";

// Instanciando o Prisma Client
export const prisma = new PrismaClient();

export async function paymentValidController(fastify: FastifyInstance) {
  // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook
  fastify.post("/webhook", async (request, reply) => {
    const { payment_id, status, user_id } = request.body as {
      payment_id: string;
      status: string;
      user_id: string;
    };

    if (!payment_id || !status || !user_id) {
      return reply.status(400).send({ error: "Dados inválidos" });
    }

    // Salvar no banco, se ainda não existir
    await prisma.payment.upsert({
      where: { payment_id },
      update: { status },
      create: {
        payment_id,
        status,
        user_id,
        used: false,
      },
    });
    const cobrance = await prismaClient.cobrance.findFirst({
      where: { idCobrance: user_id },
    });

    if (!cobrance) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }

    if (status === "approved") {
      await prisma.cobrance.update({
        where: { id: cobrance.id },
        data: { status: "PAGO" },
      });
    }

    return reply.send({ message: "Pagamento registrado" });
  });

  // 2️⃣ Atualizar pagamento para "usado" quando o plano for ativado
  fastify.put("/activate/:payment_id", async (request, reply) => {
    const { payment_id } = request.params as { payment_id: string };

    // Buscar o pagamento no banco
    const payment = await prisma.payment.findUnique({ where: { payment_id } });

    if (!payment) {
      return reply.status(404).send({ error: "Pagamento não encontrado" });
    }

    if (payment.used) {
      return reply.status(400).send({ error: "Pagamento já foi utilizado" });
    }

    // Atualizar para "usado"
    await prisma.payment.update({
      where: { payment_id },
      data: { used: true },
    });

    return reply.send({ message: "Plano ativado com sucesso!" });
  });
}
