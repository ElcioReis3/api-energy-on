import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerServices } from "../services/ListCustomerServices";

class ListCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { privy, birth } = request.query as {
      privy?: string;
      birth?: string;
    };

    const birthDate = birth ? new Date(birth) : undefined;

    const listCustomerServices = new ListCustomerServices();
    const clients = await listCustomerServices.execute(privy, birthDate);

    reply.send({ clients });
  }
}

export { ListCustomerController };
