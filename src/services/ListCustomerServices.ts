import prismaClient from "../prisma";

class ListCustomerServices {
  async execute(privy: string, birth: Date) {
    const client = await prismaClient.client.findFirst({
      where: {
        privy,
        birth,
      },
    });
    return client;
  }
}

export { ListCustomerServices };
