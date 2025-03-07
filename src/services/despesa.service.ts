import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDespesaPARCELADO = async (despesas: any[]) => {
  return await prisma.$transaction(async (prisma) => {
    const despesasCriadas = [];

    for (const despesa of despesas) {
      // Valida se a pessoa existe
      const pessoaExistente = await prisma.pessoa.findUnique({
        where: { id: despesa.pessoaId },
      });
      if (!pessoaExistente) {
        throw new Error(`Pessoa com id ${despesa.pessoaId} não encontrada`);
      }

      // Valida se o cartão existe (caso o cartão seja obrigatório)
      const cartaoExistente = await prisma.cartao.findUnique({
        where: { id: despesa.cartaoId },
      });
      if (!cartaoExistente) {
        throw new Error(`Cartão com id ${despesa.cartaoId} não encontrado`);
      }

      // Cria a despesa com as informações da parcela
      const despesaCriada = await prisma.despesa.create({
        data: {
          valor: despesa.valor,
          dataVencimento: despesa.dataVencimento,
          descricao: despesa.descricao,
          pessoaId: despesa.pessoaId,
          cartaoId: despesa.cartaoId,
          tipoDespesa: "PARCELADO",
          mesReferencia: despesa.mesReferencia,
          quantParcelas: despesa.quantParcelas,
          referenciaParcela: despesa.referenciaParcela,
        },
      });

      despesasCriadas.push(despesaCriada);
    }

    return despesasCriadas;
  });
};
