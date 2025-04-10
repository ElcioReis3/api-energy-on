"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCustomerController = void 0;
const DeleteCustomerServices_1 = require("../services/DeleteCustomerServices");
class DeleteCustomerController {
    async handle(request, reply) {
        const { id } = request.query;
        const deleteCustomerService = new DeleteCustomerServices_1.DeleteCustomerServices();
        const customer = await deleteCustomerService.execute({
            id,
        });
        reply.send(customer);
    }
}
exports.DeleteCustomerController = DeleteCustomerController;
