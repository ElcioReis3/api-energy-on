"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMeterController = void 0;
const ListMeterServices_1 = require("../services/ListMeterServices");
class ListMeterController {
    async handle(request, reply) {
        const { meter } = request.query;
        const listMeterServices = new ListMeterServices_1.ListMeterServices();
        const client = await listMeterServices.execute(meter);
        reply.send({ client });
    }
}
exports.ListMeterController = ListMeterController;
