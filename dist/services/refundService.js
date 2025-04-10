"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRefund = processRefund;
const axios_1 = __importDefault(require("axios"));
/**
 * Processa o reembolso de um pagamento no Mercado Pago.
 * @param paymentId ID do pagamento no Mercado Pago.
 * @param type Tipo de reembolso: "full" (integral) ou "partial" (parcial).
 */
async function processRefund(paymentId, type) {
    try {
        // Buscar os detalhes do pagamento para calcular o valor correto do reembolso
        const paymentDetails = await axios_1.default.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        });
        const totalAmount = paymentDetails.data.transaction_amount;
        const refundAmount = type === "full" ? totalAmount : totalAmount * 0.5; // 50% para reembolso parcial
        const response = await axios_1.default.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, type === "full" ? {} : { amount: refundAmount }, // Envia o valor apenas se for parcial
        {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });
        const refundData = response.data;
        // Função para formatar a mensagem
        const refundMessage = (refundData) => {
            return `✅ **Reembolso ${refundData.refund_mode === "standard" ? "integral" : "parcial"} realizado com sucesso!**\n

      📌 **Detalhes do Reembolso**:\n
      - 💰 **Valor reembolsado**: R$ ${refundData.amount_refunded_to_payer.toFixed(2)}\n
      - 📅 **Data do Reembolso**: ${new Date(refundData.date_created).toLocaleString("pt-BR")}\n
      - 🆔 **ID do Reembolso**: ${refundData.id}\n
      - 🔗 **ID do Pagamento**: ${refundData.payment_id}\n
      - ✅ **Status**: ${refundData.status === "approved" ? "Aprovado" : refundData.status}\n

      Se precisar de mais informações, entre em contato com o suporte.`;
        };
        return {
            success: true,
            refund: refundData,
            message: refundMessage(refundData),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Erro ao processar reembolso:", error.message);
            throw new Error("Erro ao processar reembolso: " + error.message);
        }
        else {
            console.error("Erro desconhecido:", error);
            throw new Error("Erro desconhecido ao processar reembolso");
        }
    }
}
