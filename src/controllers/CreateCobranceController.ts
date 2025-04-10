import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCobranceServices } from "../services/CreateCobranceServices";

class CreateCobranceController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {
      name,
      count_meter,
      meter,
      currentDate,
      maturityDate,
      price,
      status,
    } = request.body as {
      name: string;
      count_meter: number;
      currentDate: Date;
      maturityDate: Date;
      meter: string;
      price: number;
      status: "ABERTO" | "VENCIDO" | "PAGO";
    };

    const cobranceService = new CreateCobranceServices();

    const cobrance = await cobranceService.execute({
      name,
      count_meter,
      meter,
      currentDate,
      maturityDate,
      price,
      status,
    });

    reply.send(cobrance);
  }
}

export { CreateCobranceController };
