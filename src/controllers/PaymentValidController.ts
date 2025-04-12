import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prismaClient from "../prisma";
import { Payment } from "mercadopago";
import mercadopago from "../config/mercadopago";

// Instanciando o Prisma Client
export const prisma = new PrismaClient();

export async function paymentValidController(fastify: FastifyInstance) {
  // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook
  fastify.post("/webhook", async (request, reply) => {
    const { id, type } = request.body as {
      id: string;
      type: string;
    };

    if (type !== "payment") {
      return reply.status(400).send({ error: "Evento não tratado" });
    }

    try {
      const paymentClient = new Payment(mercadopago);
      const payment = await paymentClient.get({ id });

      const { status, external_reference, id: payment_id } = payment;

      if (!external_reference || !payment_id || !status) {
        return reply
          .status(400)
          .send({ error: "Dados incompletos do pagamento" });
      }

      // Salvar no banco (upsert)
      await prisma.payment.upsert({
        where: { payment_id: String(payment_id) },
        update: { status },
        create: {
          payment_id: String(payment_id),
          status,
          user_id: external_reference, // cobrancaId
          used: false,
        },
      });

      // Atualizar status da cobrança
      const cobrance = await prismaClient.cobrance.findFirst({
        where: { idCobrance: external_reference },
      });

      if (!cobrance) {
        return reply.status(404).send({ error: "Cobrança não encontrada" });
      }

      if (status === "approved") {
        await prisma.cobrance.update({
          where: { id: cobrance.id },
          data: { status: "PAGO" },
        });
      }

      return reply.send({ message: "Pagamento registrado com sucesso" });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
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
