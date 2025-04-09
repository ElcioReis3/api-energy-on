import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerServices } from "../services/CreateCustomerServices";

class CreateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, address, email, contact, meter, birth, privy, count_meter } =
      request.body as {
        name: string;
        email: string;
        address?: string;
        contact?: string;
        meter: string;
        birth: Date;
        privy: string;
        count_meter: number;
      };

    const customerService = new CreateCustomerServices();

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

export { CreateCustomerController };
