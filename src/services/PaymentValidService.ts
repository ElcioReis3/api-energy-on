import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PaymentValidService {
  async registerPayment(payment_id: string, status: string, user_id: string) {
    const existingPayment = await prisma.payment.findUnique({
      where: { payment_id },
    });

    if (existingPayment) {
      throw new Error("Pagamento já registrado.");
    }

    return prisma.payment.create({
      data: {
        payment_id,
        status,
        user_id,
        used: false, // Inicialmente false
      },
    });
  }

  async verifyPayment(payment_id: string) {
    const payment = await prisma.payment.findUnique({
      where: { payment_id },
    });

    if (!payment) {
      throw new Error("Pagamento não encontrado.");
    }

    if (payment.used) {
      throw new Error("Pagamento já foi utilizado.");
    }

    return payment; // Apenas retorna os dados sem alterar 'used'
  }

  async confirmPaymentUsage(payment_id: string) {
    const payment = await prisma.payment.findUnique({
      where: { payment_id },
    });

    if (!payment) {
      throw new Error("Pagamento não encontrado.");
    }

    if (payment.used) {
      throw new Error("Pagamento já foi utilizado.");
    }

    return prisma.payment.update({
      where: { payment_id },
      data: { used: true },
    });
  }
}
