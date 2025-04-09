import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerServices } from "../services/ListCustomerServices";

class ListCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { privy, birth } = request.query as {
      privy: string;
      birth: Date;
    };
    if (!privy || !birth) {
      return reply.code(400).send("Dados são obrigatórios");
    }

    const birthDate = new Date(birth);
    const listCustomerServices = new ListCustomerServices();
    const client = await listCustomerServices.execute(privy, birthDate);

    reply.send({ client });
  }
}

export { ListCustomerController };
