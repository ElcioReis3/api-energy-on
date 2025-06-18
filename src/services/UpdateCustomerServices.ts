import prismaClient from "../prisma";

interface UpdateCustomerProps {
  id: string;
  name: string;
  email: string;
  address?: string;
  contact?: string;
  meter: string;
  birth: Date;
  privy: string;
  count_meter: number[];
}

class UpdateCustomerServices {
  async execute({
    id,
    name,
    email,
    address,
    birth,
    count_meter,
    meter,
    privy,
    contact,
  }: UpdateCustomerProps) {
    if (!id) {
      throw new Error("ID do cliente é obrigatório");
    }
    const customerExists = await prismaClient.client.findUnique({
      where: {
        id,
      },
    });

    if (!customerExists) {
      throw new Error("Cliente não encontrado");
    }

    // Atualiza somente os campos enviados
    const updatedCustomer = await prismaClient.client.update({
      where: { id },
      data: {
        name: name || customerExists.name,
        email: email || customerExists.email,
        address: address || customerExists.address,
        birth: birth || customerExists.birth,
        contact: contact || customerExists.contact,
        count_meter: count_meter || customerExists.count_meter,
        meter: meter || customerExists.meter,
        privy: privy || customerExists.privy,
      },
    });

    return updatedCustomer;
  }
}

export { UpdateCustomerServices };
