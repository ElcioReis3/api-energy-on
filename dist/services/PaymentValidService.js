"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentValidService {
    async registerPayment(payment_id) {
        const existingPayment = await prisma.cobrance.findFirst({
            where: { id: payment_id },
        });
        console.log(payment_id);
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
exports.PaymentValidService = PaymentValidService;
