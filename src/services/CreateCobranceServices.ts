import prismaClient from "../prisma";
import { differenceInDays } from "date-fns";

interface CreateCobranceProps {
  name: string;
  count_meter: number;
  currentDate: Date;
  maturityDate: Date;
  meter: string;
  price: number;
  status: "ABERTO" | "VENCIDO" | "PAGO";
  idCobrance?: string;
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
    idCobrance,
  }: CreateCobranceProps) {
    try {
      const ultimaCobranca = await prismaClient.cobrance.findFirst({
        where: { meter },
        orderBy: { currentDate: "desc" },
      });
      if (ultimaCobranca) {
        const diferencaEmDias = differenceInDays(
          new Date(currentDate),
          new Date(ultimaCobranca.currentDate)
        );

        console.log("Diferença em dias:", diferencaEmDias);

        if (diferencaEmDias <= 1) {
          throw new Error(
            "A nova cobrança deve ter pelo menos 30 dias de diferença da última."
          );
        }
      }
      const cliente = await prismaClient.client.findFirst({
        where: { meter },
      });

      if (!cliente) {
        throw new Error("Cliente não encontrado.");
      }
      const newCobrance = await prismaClient.cobrance.create({
        data: {
          idCobrance: cliente.id,
          name,
          count_meter,
          meter,
          currentDate: new Date(currentDate),
          maturityDate: new Date(maturityDate),
          price,
          status,
        },
      });

      await prismaClient.client.update({
        where: { id: cliente.id },
        data: { count_meter },
      });

      return newCobrance;
    } catch (err: any) {
      console.error("Erro ao criar cobrança:", err);
      throw new Error(err.message);
    }
  }
}

export { CreateCobranceServices };
