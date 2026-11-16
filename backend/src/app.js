import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";
import { veiculoRoutes } from "./routes/veiculo.routes.js";
import { locacaoRoutes } from "./routes/locacao.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/locacoes", locacaoRoutes);

app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada" }));
app.use(errorHandler);
