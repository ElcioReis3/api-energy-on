"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.paymentValidController = paymentValidController;
const client_1 = require("@prisma/client");
const mercadopago_1 = require("mercadopago");
const mercadopago_2 = __importDefault(require("../config/mercadopago"));
exports.prisma = new client_1.PrismaClient();
const paymentInstance = new mercadopago_1.Payment(mercadopago_2.default);
async function paymentValidController(fastify) {
    // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook
    fastify.post("/webhook", async (request, reply) => {
        const { payment_id, status, user_id } = request.body;
        if (!payment_id || !status || !user_id) {
            return reply.status(400).send({ error: "Dados inválidos" });
        }
        // Salvar no banco, se ainda não existir
        await exports.prisma.payment.upsert({
            where: { payment_id },
            update: { status },
            create: {
                payment_id,
                status,
                user_id,
                used: false,
            },
        });
        if (status === "approved") {
            await exports.prisma.cobrance.update({
                where: { id: user_id },
                data: { status: "PAGO" },
            });
        }
        return reply.send({ message: "Pagamento registrado" });
    });
    // 2️⃣ Atualizar pagamento para "usado" quando o plano for ativado
    fastify.put("/activate/:payment_id", async (request, reply) => {
        const { payment_id } = request.params;
        // Buscar o pagamento no banco
        const payment = await exports.prisma.payment.findUnique({ where: { payment_id } });
        if (!payment) {
            return reply.status(404).send({ error: "Pagamento não encontrado" });
        }
        if (payment.used) {
            return reply.status(400).send({ error: "Pagamento já foi utilizado" });
        }
        // Atualizar para "usado"
        await exports.prisma.payment.update({
            where: { payment_id },
            data: { used: true },
        });
        return reply.send({ message: "Plano ativado com sucesso!" });
    });
}
