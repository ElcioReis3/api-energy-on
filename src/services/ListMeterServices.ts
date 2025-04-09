import prismaClient from "../prisma";

class ListMeterServices {
  async execute(meter: string) {
    const client = await prismaClient.client.findFirst({
      where: {
        meter: String(meter),
      },
    });
    return client;
  }
}

export { ListMeterServices };
