import { FastifyRequest, FastifyReply } from "fastify";
import { ListMeterServices } from "../services/ListMeterServices";

class ListMeterController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { meter } = request.query as {
      meter: string;
    };
    const listMeterServices = new ListMeterServices();
    const client = await listMeterServices.execute(meter);

    reply.send({ client });
  }
}

export { ListMeterController };
