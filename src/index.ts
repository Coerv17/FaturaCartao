import express, { Request, Response } from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

// Suas rotas aqui
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API está no ar!" });
});

export default serverless(app);
