import { FastifyRequest, FastifyReply } from "fastify";
import { ListCobrancesServices } from "../services/ListCobrancesServices";

class ListCobrancesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { meter } = request.query as {
      meter?: string;
    };

    const listCobrancesServices = new ListCobrancesServices();
    const cobrances = await listCobrancesServices.execute(meter);

    reply.send({ cobrances });
  }
}

export { ListCobrancesController };
