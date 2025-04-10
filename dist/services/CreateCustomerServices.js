"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CreateCustomerServices {
    async execute({ name, email, address, birth, count_meter, meter, privy, contact, }) {
        if (!name || !email) {
            throw new Error("Preencha todos os campos");
        }
        const emailExists = await prisma_1.default.client.findFirst({
            where: {
                email,
                privy,
                meter,
            },
        });
        if (emailExists) {
            throw new Error("Já existe um cliente com este CPF/CNPJ ou número de medidor.");
        }
        const newClient = await prisma_1.default.client.create({
            data: {
                name,
                email,
                address,
                birth: new Date(birth).toISOString(),
                count_meter,
                meter,
                privy,
                contact,
            },
        });
        return newClient;
    }
}
exports.CreateCustomerServices = CreateCustomerServices;
