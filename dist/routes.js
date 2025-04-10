"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.routes = routes;
const CreateCustomerController_js_1 = require("./controllers/CreateCustomerController.js");
const ListCustomerController_js_1 = require("./controllers/ListCustomerController.js");
const DeleteCustomerController_js_1 = require("./controllers/DeleteCustomerController.js");
const UpdateCustomerController_js_1 = require("./controllers/UpdateCustomerController.js");
const PaymentValidController_js_1 = require("./controllers/PaymentValidController.js");
const client_1 = require("@prisma/client");
const paymentController_js_1 = require("./controllers/paymentController.js");
const ListCobrancesController_js_1 = require("./controllers/ListCobrancesController.js");
const ListMeterController_js_1 = require("./controllers/ListMeterController.js");
exports.prisma = new client_1.PrismaClient();
async function routes(fastify, options) {
    fastify.get("/initial", async (request, reply) => {
        return {
            ok: true,
        };
    });
    fastify.post("/adm/add-client", async (request, reply) => {
        return new CreateCustomerController_js_1.CreateCustomerController().handle(request, reply);
    });
    fastify.get("/consult-client", async (request, reply) => {
        return new ListCustomerController_js_1.ListCustomerController().handle(request, reply);
    });
    fastify.get("/consult-meter", async (request, reply) => {
        return new ListCobrancesController_js_1.ListCobrancesController().handle(request, reply);
    });
    fastify.post("/create-cobrance", async (request, reply) => {
        return new ListCobrancesController_js_1.ListCobrancesController().handle(request, reply);
    });
    fastify.get("/get-client/:meter", async (request, reply) => {
        return new ListMeterController_js_1.ListMeterController().handle(request, reply);
    });
    fastify.get("/", async (request, reply) => {
        return { status: "API is running" };
    });
    fastify.delete("/delete-client", async (request, reply) => {
        return new DeleteCustomerController_js_1.DeleteCustomerController().handle(request, reply);
    });
    fastify.put("/edit-client", async (request, reply) => {
        return new UpdateCustomerController_js_1.UpdateCustomerController().handle(request, reply);
    });
    fastify.post("/payment", paymentController_js_1.checkout);
    fastify.register(PaymentValidController_js_1.paymentValidController, { prefix: "/payments" });
}
