"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCobranceServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const date_fns_1 = require("date-fns");
class CreateCobranceServices {
    async execute({ name, count_meter, meter, currentDate, maturityDate, price, status, }) {
        try {
            const ultimaCobranca = await prisma_1.default.cobrance.findFirst({
                where: { meter },
                orderBy: { currentDate: "desc" },
            });
            if (ultimaCobranca) {
                const diferencaEmDias = (0, date_fns_1.differenceInDays)(new Date(currentDate), new Date(ultimaCobranca.currentDate));
                console.log("Diferença em dias:", diferencaEmDias);
                if (diferencaEmDias <= 1) {
                    throw new Error("A nova cobrança deve ter pelo menos 30 dias de diferença da última.");
                }
            }
            const cliente = await prisma_1.default.client.findFirst({
                where: { meter },
            });
            if (!cliente) {
                throw new Error("Cliente não encontrado.");
            }
            const newCobrance = await prisma_1.default.cobrance.create({
                data: {
                    name,
                    count_meter,
                    meter,
                    currentDate: new Date(currentDate),
                    maturityDate: new Date(maturityDate),
                    price,
                    status,
                },
            });
            await prisma_1.default.client.update({
                where: { id: cliente.id },
                data: { count_meter },
            });
            return newCobrance;
        }
        catch (err) {
            console.error("Erro ao criar cobrança:", err);
            throw new Error(err.message);
        }
    }
}
exports.CreateCobranceServices = CreateCobranceServices;
