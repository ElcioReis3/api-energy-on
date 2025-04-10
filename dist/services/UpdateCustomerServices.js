"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class UpdateCustomerServices {
    async execute({ id, name, email, address, birth, count_meter, meter, privy, contact, }) {
        if (!id) {
            throw new Error("ID do cliente é obrigatório");
        }
        const customerExists = await prisma_1.default.client.findUnique({
            where: {
                id,
            },
        });
        if (!customerExists) {
            throw new Error("Cliente não encontrado");
        }
        // Atualiza somente os campos enviados
        const updatedCustomer = await prisma_1.default.client.update({
            where: { id },
            data: {
                name: name || customerExists.name,
                email: email || customerExists.email,
                address: address || customerExists.address,
                birth: birth || customerExists.birth,
                contact: contact || customerExists.contact,
                count_meter: count_meter || customerExists.count_meter,
                meter: meter || customerExists.meter,
                privy: privy || customerExists.privy,
            },
        });
        return updatedCustomer;
    }
}
exports.UpdateCustomerServices = UpdateCustomerServices;
