import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PaymentValidService {
  async registerPayment(payment_id: string) {
    const existingPayment = await prisma.cobrance.findFirst({
      where: { id: payment_id },
    });

    if (existingPayment) {
      throw new Error("Pagamento já registrado.");
    }

    // return prisma.cobrance.update({
    //   data: {
    //     where: { id: payment_id },
    //     status: "PAGO",
    //   },
    // });
  }
}
