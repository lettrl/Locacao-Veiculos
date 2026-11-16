import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

export const authRoutes = Router();

authRoutes.post("/registrar", authController.registrar);
authRoutes.post("/login", authController.login);
authRoutes.get("/perfil", auth, authController.perfil);
