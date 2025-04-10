"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mercadopago_1 = require("mercadopago");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mercadopago = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});
exports.default = mercadopago;
