"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCobrancesServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ListCobrancesServices {
    async execute(meter) {
        const whereClause = meter ? { meter } : {};
        const cobrances = await prisma_1.default.cobrance.findMany({
            where: whereClause,
            orderBy: {
                currentDate: "desc",
            },
        });
        return cobrances;
    }
}
exports.ListCobrancesServices = ListCobrancesServices;
