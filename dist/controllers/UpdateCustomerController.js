"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerController = void 0;
const UpdateCustomerServices_1 = require("../services/UpdateCustomerServices");
class UpdateCustomerController {
    async handle(request, reply) {
        const { id } = request.query;
        const { name, email, address, birth, count_meter, meter, privy, contact } = request.body;
        const customerService = new UpdateCustomerServices_1.UpdateCustomerServices();
        try {
            const updatedCustomer = await customerService.execute({
                id,
                name,
                email,
                address,
                birth,
                count_meter,
                meter,
                privy,
                contact,
            });
            return reply.status(200).send(updatedCustomer);
        }
        catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    }
}
exports.UpdateCustomerController = UpdateCustomerController;
