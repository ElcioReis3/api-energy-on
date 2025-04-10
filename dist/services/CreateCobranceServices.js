"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCobranceServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CreateCobranceServices {
    async execute({ name, count_meter, meter, currentDate, maturityDate, price, status, }) {
        try {
            const dataAtual = new Date(currentDate);
            const newCobrance = await prisma_1.default.cobrance.create({
                data: {
                    name,
                    count_meter,
                    meter,
                    currentDate: dataAtual,
                    maturityDate: new Date(maturityDate),
                    price,
                    status,
                },
            });
            const cliente = await prisma_1.default.client.findFirst({ where: { meter } });
            if (!cliente) {
                throw new Error("Cliente não encontrado.");
            }
            await prisma_1.default.client.update({
                where: { id: cliente.id },
                data: { count_meter },
            });
            return newCobrance;
        }
        catch (e) {
            throw new Error("Erro ao criar cobrança.");
        }
    }
}
exports.CreateCobranceServices = CreateCobranceServices;
