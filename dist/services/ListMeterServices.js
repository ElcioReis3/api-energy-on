"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMeterServices = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ListMeterServices {
    async execute(meter) {
        const client = await prisma_1.default.client.findFirst({
            where: {
                meter: String(meter),
            },
        });
        return client;
    }
}
exports.ListMeterServices = ListMeterServices;
