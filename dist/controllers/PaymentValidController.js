"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.paymentValidController = paymentValidController;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
// Instanciando o Prisma Client
exports.prisma = new client_1.PrismaClient();
async function paymentValidController(fastify) {
    // 1️⃣Atualiza o status
    // fastify.post("/webhook", async (request, reply) => {
    //   const { payment_id, status } = request.body as {
    //     payment_id: string;
    //     status: string;
    //   };
    //   console.log("iniciou o webhook", payment_id, status);
    //   if (!payment_id || !status) {
    //     return reply.status(400).send({ error: "Dados inválidos" });
    //   }
    //   if (status === "approved") {
    //     await prisma.cobrance.update({
    //       where: { id: payment_id },
    //       data: { status: "PAGO" },
    //     });
    //   }
    //   return reply.send({ message: "Pagamento registrado" });
    // });
    fastify.post("/webhook", async (request, reply) => {
        const { id, topic } = request.query;
        console.log("Webhook recebido:", id, topic);
        if (topic !== "payment") {
            return reply.status(400).send({ error: "Tipo de evento inválido" });
        }
        try {
            // Busca os detalhes do pagamento no Mercado Pago
            const response = await axios_1.default.get(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
            });
            const payment = response.data;
            const status = payment.status;
            const cobrancaId = payment.external_reference;
            console.log("Pagamento recebido:", status, cobrancaId);
            if (status === "approved" && cobrancaId) {
                await exports.prisma.cobrance.update({
                    where: { id: cobrancaId },
                    data: { status: "PAGO" },
                });
            }
            return reply.send({ message: "Pagamento processado com sucesso" });
        }
        catch (err) {
            console.error("Erro ao processar webhook:", err);
            return reply.status(500).send({ error: "Erro ao verificar pagamento" });
        }
    });
    // 2️⃣ Atualizar pagamento para "usado" quando o plano for ativado
    fastify.put("/activate/:payment_id", async (request, reply) => {
        const { payment_id } = request.params;
        if (!payment_id) {
            return reply.status(404).send({ error: "Pagamento não encontrado" });
        }
        // Atualizar para "usado"
        await exports.prisma.cobrance.update({
            where: { id: payment_id },
            data: { status: "PAGO" },
        });
        return reply.send({ message: "Plano ativado com sucesso!" });
    });
}
