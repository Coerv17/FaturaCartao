import { Request, Response, NextFunction } from 'express';
import { TipoDespesa } from '@prisma/client';

export const validarTipoDespesaMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { tipoDespesa } = req.body;

  // Verifica se o campo foi enviado e é uma string
  if (!tipoDespesa || typeof tipoDespesa !== 'string') {
    res.status(400).json({ message: 'Tipo de despesa é obrigatório e deve ser uma string.' });
    return; // Evita a execução do próximo middleware/controller após erro
  }

  // Converte para maiúsculas para garantir consistência
  const tipo = tipoDespesa.toUpperCase();

  // Pega os tipos válidos definidos no enum
  const tiposValidos = Object.values(TipoDespesa);

  if (!tiposValidos.includes(tipo as TipoDespesa)) {
    res.status(400).json({
      message: `Tipo de despesa inválido. Valores permitidos: ${tiposValidos.join(', ')}.`
    });
    return; // Evita a execução do próximo middleware/controller após erro
  }

  // Atualiza o valor no body para garantir o formato correto
  req.body.tipoDespesa = tipo;

  // Chama o próximo middleware ou controller
  next();
};
