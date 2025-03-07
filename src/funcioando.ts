import { Request, Response } from "express";
import { createDespesaPARCELADO, createDespesaSimples, findAllService } from "../services/despesa.service";
import { addMonths, format } from "date-fns";

export const criarDespesa = async (req: Request, res: Response) => {
  try {
    const { tipoDespesa } = req.body;
    //console.log(`ESCOLHIDO ${tipoDespesa}`);
    const { valor, dataVencimento, descricao, pessoaId, cartaoId, quantParcelas } = req.body;
    //DEIXANDO A DATA GENERICA
    const data = new Date(dataVencimento);
    if (isNaN(data.getTime())) {
      res.status(400).json({ message: "Data de vencimento inválida" });
      return;
    }
    const mesReferencia = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

    if (tipoDespesa === "SIMPLES") {
      const despesa = {
        valor,
        dataVencimento: data,
        descricao,
        pessoaId,
        cartaoId,
        mesReferencia,
      };
      const novaDespesa = await createDespesaSimples(despesa);
      res.status(201).json(novaDespesa);

      //////
    } else if (tipoDespesa === "PARCELADO") {
      const parcelas = [];
      for (let i = 0; i < quantParcelas; i++) {
        const dataParcela = addMonths(new Date(dataVencimento), i);
        const mesReferenciaParcela = format(dataParcela, "yyyy-MM"); // Calcula o mês correto

        parcelas.push({ parcela: i + 1, dataParcela, valor, mesReferencia: mesReferenciaParcela }); // Mantém o mesmo valor em todas
      }

      const despesaquery = {
        valor,
        dataVencimento: data,
        descricao,
        pessoaId,
        cartaoId,
        parcelas,
      };
      //console.log("Dados enviados para o service:", JSON.stringify(despesaquery, null, 2));

      const novaDespesaParcelado = await createDespesaPARCELADO(despesaquery);
      res.status(200).json({ novaDespesaParcelado }); // Retorna todas as parcelas

      //////
    } else if (tipoDespesa === "DIVIDIR") {
      const valorParcelas = Math.floor((valor / quantParcelas) * 100) / 100;
      const parcelas = []; // Criar um array para armazenar todas as parcelas

      let somaParcelas = 0;
      // fazendo o for para gerar mais de uma parcela
      for (let i = 0; i < quantParcelas; i++) {
        const dataParcela = addMonths(new Date(dataVencimento), i); // Corrigindo a data

        let valorCorrigido = i === quantParcelas - 1 ? Number((valor - somaParcelas).toFixed(2)) : valorParcelas;
        somaParcelas += valorCorrigido;
        parcelas.push({ parcela: i + 1, dataParcela, valor: valorCorrigido });
      }
      const despesa = { valor, dataVencimento: data, descricao, pessoaId, cartaoId, mesReferencia };
      res.status(200).json({ parcelas }); // Retorna todas as parcelas

      //
    } else {
      res.status(400).json({ message: `Tipo de despesa ${tipoDespesa} ainda não implementado.` });
    }
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const FindaAllDepesa = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartoes = await findAllService();
    if (!cartoes || cartoes.length === 0) {
      res.status(400).send({ message: "Não há User cadastrados" });
      return;
    }
    res.status(200).json(cartoes);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao buscar os Users", error: error.message });
  }
};
