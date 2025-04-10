"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerController = void 0;
const CreateCustomerServices_1 = require("../services/CreateCustomerServices");
class CreateCustomerController {
    async handle(request, reply) {
        const { name, address, email, contact, meter, birth, privy, count_meter } = request.body;
        const customerService = new CreateCustomerServices_1.CreateCustomerServices();
        const customer = await customerService.execute({
            name,
            email,
            address,
            birth,
            count_meter,
            meter,
            privy,
            contact,
        });
        reply.send(customer);
    }
}
exports.CreateCustomerController = CreateCustomerController;
