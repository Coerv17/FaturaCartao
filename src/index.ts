import express, { Request, Response } from "express"; // Corrigido para "Response"

import createcartoes from "../src/router/cartoes.router";
import createDespesa from "../src/router/despesa.router";
import createUser from "../src/router/user.router";

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

app.use("/user", createUser);
app.use("/cartoes", createcartoes);
app.use("/despesa", createDespesa);

// Rota padrão para verificar se a API está no ar
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API está no ar!" });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
