import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Token não informado", 401));
  }
  try {
    const payload = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.usuarioId = payload.id;
    next();
  } catch {
    next(new AppError("Token inválido ou expirado", 401));
  }
}