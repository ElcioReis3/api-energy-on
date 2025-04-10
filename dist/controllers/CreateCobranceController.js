"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCobranceController = void 0;
const CreateCobranceServices_1 = require("../services/CreateCobranceServices");
class CreateCobranceController {
    async handle(request, reply) {
        const { name, count_meter, meter, currentDate, maturityDate, price, status, } = request.body;
        const cobranceService = new CreateCobranceServices_1.CreateCobranceServices();
        const cobrance = await cobranceService.execute({
            name,
            count_meter,
            meter,
            currentDate,
            maturityDate,
            price,
            status,
        });
        reply.send(cobrance);
    }
}
exports.CreateCobranceController = CreateCobranceController;
