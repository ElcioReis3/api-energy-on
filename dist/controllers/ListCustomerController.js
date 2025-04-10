"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerController = void 0;
const ListCustomerServices_1 = require("../services/ListCustomerServices");
class ListCustomerController {
    async handle(request, reply) {
        const { privy, birth } = request.query;
        if (!privy || !birth) {
            return reply.code(400).send("Dados são obrigatórios");
        }
        const birthDate = new Date(birth);
        const listCustomerServices = new ListCustomerServices_1.ListCustomerServices();
        const client = await listCustomerServices.execute(privy, birthDate);
        reply.send({ client });
    }
}
exports.ListCustomerController = ListCustomerController;
