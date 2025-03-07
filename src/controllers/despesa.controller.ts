import { Request, Response } from "express";
import { addMonths, format } from "date-fns";
import { createDespesaPARCELADO } from "../services/despesa.service";

// Função auxiliar para validar a data de vencimento
const validarDataVencimento = (dataVencimento: string): { data: Date; mesReferencia: string } | null => {
  const data = new Date(dataVencimento);
  if (isNaN(data.getTime())) return null;
  const mesReferencia = format(data, "yyyy-MM");
  return { data, mesReferencia };
};

export const despesaPARCELADO = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valor, dataVencimento, descricao, pessoaId, cartaoId, quantParcelas, dividir } = req.body;
    const validacao = validarDataVencimento(dataVencimento);
    if (!validacao) {
      res.status(400).json({ message: "Data de vencimento inválida" });
      return;
    }

    const despesas = [];
    const dataBase = new Date(dataVencimento);
    const ultimoDiaDoMesUTC = new Date(
      Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth() + 1, 0)
    ).getUTCDate();
    const isUltimoDia = dataBase.getUTCDate() === ultimoDiaDoMesUTC;

    // Se a flag 'dividir' for true, divide o valor entre as parcelas
    const valorParcela = dividir ? valor / quantParcelas : valor;

    for (let i = 0; i < quantParcelas; i++) {
      let dataParcela;
      if (isUltimoDia) {
        dataParcela = new Date(
          Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth() + i + 1, 0)
        );
      } else {
        dataParcela = addMonths(dataBase, i);
      }
      const mesReferencia = format(dataParcela, "yyyy-MM");

      // Gera a referência da parcela (ex: "1/4", "2/4", etc.)
      const referenciaParcela = `${i + 1}/${quantParcelas}`;

      despesas.push({
        valor: Number(valorParcela.toFixed(2)), // Valor com duas casas decimais
        dataVencimento: dataParcela,
        descricao,
        pessoaId,
        cartaoId,
        mesReferencia,
        quantParcelas,          // Total de parcelas
        referenciaParcela,      // Referência da parcela atual
      });
    }

    console.log("Dados enviados para o service:", JSON.stringify(despesas, null, 2));
    const passandoService = await createDespesaPARCELADO(despesas);
    res.status(201).json(passandoService);
  } catch (error) {
    console.error("Erro ao criar despesa parcelada:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
