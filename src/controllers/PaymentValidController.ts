import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

// Instanciando o Prisma Client
export const prisma = new PrismaClient();

export async function paymentValidController(fastify: FastifyInstance) {
  // 1️⃣Atualiza o status
  // fastify.post("/webhook", async (request, reply) => {
  //   const { payment_id, status } = request.body as {
  //     payment_id: string;
  //     status: string;
  //   };
  //   console.log("iniciou o webhook", payment_id, status);

  //   if (!payment_id || !status) {
  //     return reply.status(400).send({ error: "Dados inválidos" });
  //   }

  //   if (status === "approved") {
  //     await prisma.cobrance.update({
  //       where: { id: payment_id },
  //       data: { status: "PAGO" },
  //     });
  //   }

  //   return reply.send({ message: "Pagamento registrado" });
  // });
  fastify.post("/webhook", async (request, reply) => {
    const { id, topic } = request.query as { id: string; topic: string };

    console.log("Webhook recebido:", id, topic);

    if (topic !== "payment") {
      return reply.status(400).send({ error: "Tipo de evento inválido" });
    }

    try {
      // Busca os detalhes do pagamento no Mercado Pago
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = response.data;
      const status = payment.status;
      const cobrancaId = payment.external_reference;

      console.log("Pagamento recebido:", status, cobrancaId);

      if (status === "approved" && cobrancaId) {
        await prisma.cobrance.update({
          where: { id: cobrancaId },
          data: { status: "PAGO" },
        });
      }

      return reply.send({ message: "Pagamento processado com sucesso" });
    } catch (err) {
      console.error("Erro ao processar webhook:", err);
      return reply.status(500).send({ error: "Erro ao verificar pagamento" });
    }
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
