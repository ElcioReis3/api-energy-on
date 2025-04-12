"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PaymentValidService {
    async registerPayment(payment_id, status, user_id) {
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
    async verifyPayment(payment_id) {
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
    async confirmPaymentUsage(payment_id) {
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
exports.PaymentValidService = PaymentValidService;
