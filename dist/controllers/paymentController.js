"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const paymentService_1 = require("../services/paymentService");
const checkout = async (req, res) => {
    try {
        const { title, quantity, price, description, cobrancaId } = req.body;
        // Verifica se os dados obrigatórios foram fornecidos
        if (!title || !quantity || !price || !cobrancaId) {
            return res.status(400).send({ error: "Dados inválidos" });
        }
        // Chama o serviço para criar a preferência
        const paymentUrl = await (0, paymentService_1.createPaymentPreference)(title, quantity, price, description, cobrancaId);
        // Retorna a URL de pagamento gerada
        return res.status(200).send({ url: paymentUrl });
    }
    catch (error) {
        return res.status(500).send({ error: "Erro ao processar pagamento" });
    }
};
exports.checkout = checkout;
