"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerController = void 0;
const ListCustomerServices_1 = require("../services/ListCustomerServices");
class ListCustomerController {
    async handle(request, reply) {
        const { privy, birth } = request.query;
        const listCustomerServices = new ListCustomerServices_1.ListCustomerServices();
        let clients;
        if (privy && birth) {
            clients = await listCustomerServices.execute(privy, new Date(birth));
        }
        else {
            clients = await listCustomerServices.listAll();
        }
        reply.send({ clients });
    }
}
exports.ListCustomerController = ListCustomerController;
