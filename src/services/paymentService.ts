import { MercadoPagoConfig } from "mercadopago";
import { Preference } from "mercadopago";
import { v4 as uuidv4 } from "uuid"; // Para gerar um ID único para cada preferência

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export const createPaymentPreference = async (
  title: string,
  quantity: number,
  price: number,
  description: string,
  cobrancaId?: string
) => {
  try {
    const paymentId = uuidv4();

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
    const preference = new Preference(mercadopago);
    const response = await preference.create({ body: preferenceData }); // Passando os dados como body

    //return response.init_point;
    return response.sandbox_init_point; // A URL de pagamento
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    throw new Error("Erro ao processar pagamento");
  }
};
