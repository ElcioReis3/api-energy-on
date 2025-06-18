import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateCustomerServices } from "../services/UpdateCustomerServices";

class UpdateCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.query as { id: string };
    const { name, email, address, birth, count_meter, meter, privy, contact } =
      request.body as {
        name: string;
        email: string;
        address?: string;
        contact?: string;
        meter: string;
        birth: Date;
        privy: string;
        count_meter: number[];
      };

    const customerService = new UpdateCustomerServices();

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
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { UpdateCustomerController };
