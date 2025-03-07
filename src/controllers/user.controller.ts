import { Request, Response } from "express";
import { createUserService, findAllService } from "../services/user.service";

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  const { nome } = req.body;
  if (!nome) {
    res.status(400).json({ message: "ENVIAR OS CAMPOS OBRIGATÓRIOS!" });
    return;
  }
  try {
    const createUser = await createUserService(nome);
    res.status(201).json({ message: "User criada com sucesso!", despesa: createUser });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao criar user", error: error.message });
  }
};

export const findALLUserController = async (req: Request, res: Response): Promise<void> => {
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
