import { AppError } from "../utils/AppError.js";

function mensagemDeDuplicidade(err) {
  const alvo = String(err.meta?.target ?? "");
  if (alvo.includes("placa")) return "Placa já cadastrada";
  if (alvo.includes("email")) return "E-mail já cadastrado";
  return "Registro duplicado";
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ erro: mensagemDeDuplicidade(err) });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
}
