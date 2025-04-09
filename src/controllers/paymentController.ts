import { FastifyRequest, FastifyReply } from "fastify";
import { createPaymentPreference } from "../services/paymentService";
import { PaymentRequest } from "../interfaces/paymentRequest";

export const checkout = async (
  req: FastifyRequest<{ Body: PaymentRequest }>,
  res: FastifyReply
) => {
  try {
    const { title, quantity, price, description } = req.body;

    // Verifica se os dados obrigatórios foram fornecidos
    if (!title || !quantity || !price) {
      return res.status(400).send({ error: "Dados inválidos" });
    }

    // Chama o serviço para criar a preferência
    const paymentUrl = await createPaymentPreference(
      title,
      quantity,
      price,
      description
    );

    // Retorna a URL de pagamento gerada
    return res.status(200).send({ url: paymentUrl });
  } catch (error) {
    return res.status(500).send({ error: "Erro ao processar pagamento" });
  }
};
