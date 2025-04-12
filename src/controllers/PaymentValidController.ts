import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { Payment } from "mercadopago";
import mercadopago from "../config/mercadopago";
import { PaymentValidService } from "../services/PaymentValidService";

// Instanciando o Prisma Client
export const prisma = new PrismaClient();
const paymentInstance = new Payment(mercadopago);

export async function paymentValidController(fastify: FastifyInstance) {
  // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook

  fastify.post("/webhook", async (request, reply) => {
    const { id, topic } = request.query as { id: string; topic: string };

    if (topic !== "payment") {
      return reply.status(200).send("Not a payment event");
    }

    try {
      const response = await paymentInstance.get({ id });
      const { status, external_reference } = response;

      if (!external_reference) {
        return reply.status(400).send({ error: "Sem referência externa" });
      }

      const cobranca = await prisma.cobrance.findFirst({
        where: { idCobrance: external_reference },
      });

      if (!cobranca) {
        return reply.status(404).send({ error: "Cobrança não encontrada" });
      }

      if (status === "approved") {
        // Atualiza status da cobrança
        await prisma.cobrance.update({
          where: { id: cobranca.id },
          data: { status: "PAGO" },
        });

        // Registra o pagamento na tabela `payment`
        const paymentService = new PaymentValidService();
        await paymentService.registerPayment(
          id.toString(),
          status,
          cobranca.id // supondo que sua cobrança tenha userId
        );
      }

      return reply.send({ message: "Status atualizado com sucesso" });
    } catch (error) {
      console.error("Erro no webhook:", error);
      return reply.status(500).send({ error: "Erro interno no webhook" });
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
