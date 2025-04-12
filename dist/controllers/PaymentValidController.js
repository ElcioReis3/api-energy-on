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
const PaymentValidService_1 = require("../services/PaymentValidService");
// Instanciando o Prisma Client
exports.prisma = new client_1.PrismaClient();
const paymentInstance = new mercadopago_1.Payment(mercadopago_2.default);
async function paymentValidController(fastify) {
    // 1️⃣ Salvar pagamento quando o Mercado Pago chamar o webhook
    fastify.post("/webhook", async (request, reply) => {
        const { id, topic } = request.query;
        if (topic !== "payment") {
            return reply.status(200).send("Not a payment event");
        }
        try {
            const response = await paymentInstance.get({ id });
            const { status, external_reference } = response;
            if (!external_reference) {
                return reply.status(400).send({ error: "Sem referência externa" });
            }
            const cobranca = await exports.prisma.cobrance.findFirst({
                where: { idCobrance: external_reference },
            });
            if (!cobranca) {
                return reply.status(404).send({ error: "Cobrança não encontrada" });
            }
            if (status === "approved") {
                // Atualiza status da cobrança
                await exports.prisma.cobrance.update({
                    where: { id: cobranca.id },
                    data: { status: "PAGO" },
                });
                // Registra o pagamento na tabela `payment`
                const paymentService = new PaymentValidService_1.PaymentValidService();
                await paymentService.registerPayment(id.toString(), status, cobranca.id // supondo que sua cobrança tenha userId
                );
            }
            return reply.send({ message: "Status atualizado com sucesso" });
        }
        catch (error) {
            console.error("Erro no webhook:", error);
            return reply.status(500).send({ error: "Erro interno no webhook" });
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
