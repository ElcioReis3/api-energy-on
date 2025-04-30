"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ListCustomerServices {
    async execute(privy, birth) {
        const whereClause = {};
        if (privy)
            whereClause.privy = privy;
        if (birth)
            whereClause.birth = birth;
        const clients = await prisma_1.default.client.findMany({
            where: whereClause,
        });
        return clients;
    }
}
exports.ListCustomerServices = ListCustomerServices;
