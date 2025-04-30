"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerController = void 0;
const ListCustomerServices_1 = require("../services/ListCustomerServices");
class ListCustomerController {
    async handle(request, reply) {
        const { privy, birth } = request.query;
        const birthDate = birth ? new Date(birth) : undefined;
        const listCustomerServices = new ListCustomerServices_1.ListCustomerServices();
        const clients = await listCustomerServices.execute(privy, birthDate);
        reply.send({ clients });
    }
}
exports.ListCustomerController = ListCustomerController;
