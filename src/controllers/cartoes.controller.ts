import { Request, Response } from "express";
import { createService, findAllService } from "../services/cartoes.service";

export const createController = async (req: Request, res: Response): Promise<void> => {
  const { nome, ultimos4Digitos } = req.body;
  if (!nome || !ultimos4Digitos) {
    res.status(400).json({ message: "ENVIAR OS CAMPOS OBRIGATÓRIOS!" });
    return;
  }

  try {
    const novoCartao = await createService(nome, ultimos4Digitos);
    res.status(201).json({ message: "Cartão criado com sucesso!", cartao: novoCartao });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao criar o cartão", error: error.message });
  }
};

export const findALL = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartoes = await findAllService();
    if (!cartoes || cartoes.length === 0) {
      res.status(400).send({ message: "Não há cartões cadastrados" });
      return;
    }
    res.status(200).json(cartoes);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao buscar os cartões", error: error.message });
  }
};
