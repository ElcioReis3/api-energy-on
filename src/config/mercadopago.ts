import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export default mercadopago;
