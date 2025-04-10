import Fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { CreateCustomerController } from "./controllers/CreateCustomerController.js";
import { ListCustomerController } from "./controllers/ListCustomerController.js";
import { DeleteCustomerController } from "./controllers/DeleteCustomerController.js";
import { UpdateCustomerController } from "./controllers/UpdateCustomerController.js";
import { paymentValidController } from "./controllers/PaymentValidController.js";

import { fastifyMultipart } from "@fastify/multipart";
import { PrismaClient } from "@prisma/client";
import { checkout } from "./controllers/paymentController.js";
import { ListCobrancesController } from "./controllers/ListCobrancesController.js";
import { ListMeterController } from "./controllers/ListMeterController.js";

interface Params {
  userId: string;
}
export const prisma = new PrismaClient();

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get(
    "/initial",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        ok: true,
      };
    }
  );
  fastify.post(
    "/adm/add-client",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateCustomerController().handle(request, reply);
    }
  );
  fastify.get(
    "/consult-client",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListCustomerController().handle(request, reply);
    }
  );
  fastify.get(
    "/consult-meter",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListCobrancesController().handle(request, reply);
    }
  );
  fastify.post(
    "/create-cobrance",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListCobrancesController().handle(request, reply);
    }
  );
  fastify.get(
    "/get-client/:meter",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListMeterController().handle(request, reply);
    }
  );
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: "API is running" };
  });
  fastify.delete(
    "/delete-client",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteCustomerController().handle(request, reply);
    }
  );
  fastify.put(
    "/edit-client",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new UpdateCustomerController().handle(request, reply);
    }
  );
  fastify.post("/payment", checkout);
  fastify.register(paymentValidController, { prefix: "/payments" });
}
