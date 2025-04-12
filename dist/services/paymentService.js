"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentPreference = void 0;
const mercadopago_1 = require("mercadopago");
const mercadopago_2 = require("mercadopago");
const uuid_1 = require("uuid"); // Para gerar um ID único para cada preferência
const mercadopago = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});
const createPaymentPreference = async (title, quantity, price, description, cobrancaId) => {
    try {
        const paymentId = (0, uuid_1.v4)();
        const preferenceData = {
            items: [
                {
                    id: paymentId, // Gera um ID único para cada item
                    title,
                    quantity,
                    description,
                    currency_id: "BRL",
                    unit_price: price,
                },
            ],
            back_urls: {
                success: "https://energy-on-elcioservicos.netlify.app/payment-success",
                failure: "https://energy-on-elcioservicos.netlify.app/payment-failure",
                pending: "https://energy-on-elcioservicos.netlify.app/payment-pending",
            },
            auto_return: "approved",
            external_reference: cobrancaId,
        };
        // Criar uma preferência de pagamento
        const preference = new mercadopago_2.Preference(mercadopago);
        const response = await preference.create({ body: preferenceData }); // Passando os dados como body
        //return response.init_point;
        return response.sandbox_init_point; // A URL de pagamento
    }
    catch (error) {
        console.error("Erro ao criar pagamento:", error);
        throw new Error("Erro ao processar pagamento");
    }
};
exports.createPaymentPreference = createPaymentPreference;
