"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCustomerServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class DeleteCustomerServices {
    async execute({ id }) {
        if (!id) {
            throw new Error("Solicitação inválida");
        }
        const findCustomer = await prisma_1.default.client.findFirst({
            where: {
                id: id,
            },
        });
        if (!findCustomer) {
            throw new Error("Cliente não existe");
        }
        await prisma_1.default.client.delete({
            where: {
                id: findCustomer.id,
            },
        });
        return { message: "Deletado com sucesso!" };
    }
}
exports.DeleteCustomerServices = DeleteCustomerServices;
