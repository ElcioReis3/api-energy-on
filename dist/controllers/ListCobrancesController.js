"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCobrancesController = void 0;
const ListCobrancesServices_1 = require("../services/ListCobrancesServices");
class ListCobrancesController {
    async handle(request, reply) {
        const { meter } = request.query;
        const listCobrancesServices = new ListCobrancesServices_1.ListCobrancesServices();
        const cobrances = await listCobrancesServices.execute(meter);
        reply.send({ cobrances });
    }
}
exports.ListCobrancesController = ListCobrancesController;
