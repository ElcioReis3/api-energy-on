import prismaClient from "../prisma";

interface CreateCobranceProps {
  name: string;
  count_meter: number;
  currentDate: Date;
  maturityDate: Date;
  meter: string;
  price: number;
  status: "ABERTO" | "VENCIDO" | "PAGO";
}

class CreateCobranceServices {
  async execute({
    name,
    count_meter,
    meter,
    currentDate,
    maturityDate,
    price,
    status,
  }: CreateCobranceProps) {
    try {
      const dataAtual: Date = new Date(currentDate);
      const newCobrance = await prismaClient.cobrance.create({
        data: {
          name,
          count_meter,
          meter,
          currentDate: dataAtual,
          maturityDate: new Date(maturityDate),
          price,
          status,
        },
      });
      const cliente = await prismaClient.client.findFirst({ where: { meter } });

      if (!cliente) {
        throw new Error("Cliente não encontrado.");
      }

      await prismaClient.client.update({
        where: { id: cliente.id },
        data: { count_meter },
      });

      return newCobrance;
    } catch (e: any) {
      throw new Error("Erro ao criar cobrança.");
    }
  }
}

export { CreateCobranceServices };
