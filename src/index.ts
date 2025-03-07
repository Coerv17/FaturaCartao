import express, { Request, Response } from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

// Importação e uso das rotas
import createUser from "../src/router/user.router";
import createCartoes from "../src/router/cartoes.router";
import createDespesa from "../src/router/despesa.router";

app.use("/user", createUser);
app.use("/cartoes", createCartoes);
app.use("/despesa", createDespesa);

// Rota padrão para verificar se a API está no ar
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API está no ar!" });
});

// Exporta o app como uma função serverless
export default serverless(app);
