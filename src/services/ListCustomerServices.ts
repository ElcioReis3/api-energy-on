import prismaClient from "../prisma";

class ListCustomerServices {
  async execute(privy: string, birth: Date) {
    return await prismaClient.client.findFirst({
      where: { privy, birth },
    });
  }

  async listAll() {
    return await prismaClient.client.findMany();
  }
}

export { ListCustomerServices };
