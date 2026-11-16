import { Router } from "express";
import * as veiculoController from "../controllers/veiculo.controller.js";
import { auth } from "../middlewares/auth.js";

export const veiculoRoutes = Router();

veiculoRoutes.use(auth);
veiculoRoutes.post("/", veiculoController.criar);
veiculoRoutes.get("/", veiculoController.listar);
