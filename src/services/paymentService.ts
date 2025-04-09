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
  description: string
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
        success: "http://localhost:3000/payments/success",
        failure: "http://localhost:3000/payments/failure",
        pending: "http://localhost:3000/payments/pending",
      },
      auto_return: "approved",
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
