"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.paymentValidController = paymentValidController;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../prisma"));
const mercadopago_1 = require("mercadopago");
const mercadopago_2 = __importDefault(require("../config/mercadopago"));
// Instanciando o Prisma Client
exports.prisma = new client_1.PrismaClient();
async function paymentValidController(fastify) {
    // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook
    fastify.post("/webhook", async (request, reply) => {
        const { id, type } = request.body;
        if (type !== "payment") {
            return reply.status(400).send({ error: "Evento não tratado" });
        }
        try {
            const paymentClient = new mercadopago_1.Payment(mercadopago_2.default);
            const payment = await paymentClient.get({ id });
            const { status, external_reference, id: payment_id } = payment;
            if (!external_reference || !payment_id || !status) {
                return reply
                    .status(400)
                    .send({ error: "Dados incompletos do pagamento" });
            }
            // Salvar no banco (upsert)
            await exports.prisma.payment.upsert({
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
            const cobrance = await prisma_1.default.cobrance.findFirst({
                where: { idCobrance: external_reference },
            });
            if (!cobrance) {
                return reply.status(404).send({ error: "Cobrança não encontrada" });
            }
            if (status === "approved") {
                await exports.prisma.cobrance.update({
                    where: { id: cobrance.id },
                    data: { status: "PAGO" },
                });
            }
            return reply.send({ message: "Pagamento registrado com sucesso" });
        }
        catch (error) {
            console.error("Erro ao processar webhook:", error);
            return reply.status(500).send({ error: "Erro interno do servidor" });
        }
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
