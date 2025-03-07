import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createService = async (nome: string, ultimos4Digitos: string) => {
  const novoCartao = await prisma.cartao.create({
    data: {
      nome,
      ultimos4Digitos,
    },
  });
  return novoCartao;
};

export const findAllService = async (): Promise<any[]> => {
  try {
    const cartoes = await prisma.cartao.findMany();
    return cartoes;
  } catch (error) {
    throw error;
  }
};
