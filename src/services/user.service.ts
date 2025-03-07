import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserService = async (nome: string) => {
  const novoUser = await prisma.pessoa.create({
    data: {
      nome,
    },
  });
  return novoUser;
};
export const findAllService = async (): Promise<any[]> => {
  try {
    const cartoes = await prisma.pessoa.findMany();
    return cartoes;
  } catch (error) {
    throw error;
  }
};
