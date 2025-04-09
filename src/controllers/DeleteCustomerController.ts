import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerServices } from "../services/DeleteCustomerServices";

class DeleteCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.query as { id: string };
    const deleteCustomerService = new DeleteCustomerServices();

    const customer = await deleteCustomerService.execute({
      id,
    });

    reply.send(customer);
  }
}

export { DeleteCustomerController };
