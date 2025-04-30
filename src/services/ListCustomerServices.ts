import prismaClient from "../prisma";

class ListCustomerServices {
  async execute(privy?: string, birth?: Date) {
    const whereClause: any = {};

    if (privy) whereClause.privy = privy;
    if (birth) whereClause.birth = birth;

    const clients = await prismaClient.client.findMany({
      where: whereClause,
    });

    return clients;
  }
}

export { ListCustomerServices };
