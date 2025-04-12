"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCobranceController = void 0;
const CreateCobranceServices_1 = require("../services/CreateCobranceServices");
class CreateCobranceController {
    async handle(request, reply) {
        const { name, count_meter, meter, currentDate, maturityDate, price, idCobrance, status, } = request.body;
        const cobranceService = new CreateCobranceServices_1.CreateCobranceServices();
        try {
            const cobrance = await cobranceService.execute({
                name,
                count_meter,
                meter,
                currentDate,
                maturityDate,
                price,
                status,
                idCobrance,
            });
            reply.send(cobrance);
        }
        catch (err) {
            console.error("Erro ao criar cobrança:", err.message);
            return reply.status(400).send({ message: err.message });
        }
    }
}
exports.CreateCobranceController = CreateCobranceController;
