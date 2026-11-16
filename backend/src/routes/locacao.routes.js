import { Router } from "express";
import * as locacaoController from "../controllers/locacao.controller.js";
import { auth } from "../middlewares/auth.js";

export const locacaoRoutes = Router();

locacaoRoutes.use(auth);
locacaoRoutes.post("/", locacaoController.registrar);
locacaoRoutes.get("/", locacaoController.listar);
locacaoRoutes.patch("/:id/finalizar", locacaoController.finalizar);
