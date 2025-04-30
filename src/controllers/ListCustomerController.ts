import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerServices } from "../services/ListCustomerServices";

class ListCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { privy, birth } = request.query as {
      privy?: string;
      birth?: string;
    };

    const listCustomerServices = new ListCustomerServices();

    let clients;
    if (privy && birth) {
      clients = await listCustomerServices.execute(privy, new Date(birth));
    } else {
      clients = await listCustomerServices.listAll();
    }

    reply.send({ clients });
  }
}

export { ListCustomerController };
