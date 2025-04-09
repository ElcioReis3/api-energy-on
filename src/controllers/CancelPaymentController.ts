import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../routes";
import { processRefund } from "../services/refundService";

export class CancelPaymentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user_id } = request.body as { user_id: string };

      if (!user_id) {
        return reply.status(400).send({ error: "ID do usuário é obrigatório" });
      }

      // Buscar o cliente para pegar a data de assinatura
      const customer = await prisma.customer.findUnique({
        where: { id: user_id },
      });

      if (!customer) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      const { subscriptionDate } = customer;
      if (!subscriptionDate) {
        return reply
          .status(400)
          .send({ error: "Data de assinatura não disponível" });
      }

      const currentDate = new Date();
      const subscriptionDateObj = new Date(subscriptionDate);

      // Calculando a diferença em dias entre a data de assinatura e a data atual
      const diffTime = currentDate.getTime() - subscriptionDateObj.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24); // Diferença em dias

      let refundType: "full" | "partial" | null = null;

      if (diffDays <= 7) {
        refundType = "full"; // Reembolso integral
      } else if (diffDays <= 15) {
        refundType = "partial"; // Reembolso parcial (50%)
      }

      if (!refundType) {
        return reply
          .status(400)
          .send({ error: "Nenhum reembolso disponível após 15 dias" });
      }

      // Buscar o pagamento associado ao usuário
      const payment = await prisma.payment.findFirst({
        where: {
          user_id: user_id,
          used: true,
          status: "approved",
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (!payment) {
        return reply.status(404).send({ error: "Pagamento não encontrado" });
      }

      // Agora você tem o payment_id e pode usá-lo para o reembolso
      const refundResponse = await processRefund(
        payment.payment_id,
        refundType
      );

      try {
        // Cancela a assinatura do cliente
        await prisma.customer.update({
          where: { id: user_id },
          data: { subscriptionDate: null, dueDate: null, status: false },
        });
      } catch (updateError) {
        console.error("Erro ao atualizar status do cliente:", updateError);
        return reply.status(500).send({ error: "Erro ao cancelar assinatura" });
      }

      return reply.send({
        message: "Assinatura cancelada com sucesso.",
        refundDetails: refundResponse.message,
        refund: refundResponse.refund,
      });
    } catch (error) {
      console.error("Erro ao processar reembolso:", error);
      return reply.status(500).send({ error: "Erro ao processar reembolso" });
    }
  }
}
