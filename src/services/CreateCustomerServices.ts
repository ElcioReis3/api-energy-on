import prismaClient from "../prisma";
import bcrypt from "bcrypt";

interface CreateCustomerProps {
  name: string;
  email: string;
  address?: string;
  contact?: string;
  meter: string;
  birth: Date;
  privy: string;
  count_meter: number;
}

class CreateCustomerServices {
  async execute({
    name,
    email,
    address,
    birth,
    count_meter,
    meter,
    privy,
    contact,
  }: CreateCustomerProps) {
    if (!name || !email) {
      throw new Error("Preencha todos os campos");
    }
    const emailExists = await prismaClient.client.findFirst({
      where: {
        email,
        privy,
        meter,
      },
    });
    if (emailExists) {
      throw new Error(
        "Já existe um cliente com este CPF/CNPJ ou número de medidor."
      );
    }

    const newClient = await prismaClient.client.create({
      data: {
        name,
        email,
        address,
        birth: new Date(birth).toISOString(),
        count_meter,
        meter,
        privy,
        contact,
      },
    });

    return newClient;
  }
}

export { CreateCustomerServices };
