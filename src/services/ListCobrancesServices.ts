import prismaClient from "../prisma";

class ListCobrancesServices {
  async execute(meter?: string) {
    const whereClause = meter ? { meter } : {};

    const cobrances = await prismaClient.cobrance.findMany({
      where: whereClause,
      orderBy: {
        maturityDate: "desc",
      },
    });
    return cobrances;
  }
}

export { ListCobrancesServices };
