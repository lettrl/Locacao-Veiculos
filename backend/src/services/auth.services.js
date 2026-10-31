import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function registrar({ nome, email, senha }) {
  if (!nome || !email || !senha) throw new AppError("Nome, e-mail e senha são obrigatórios", 400);

  if (senha.length < 6) throw new AppError("A senha deve ter ao menos 6 caracteres", 400);
  const existe = await prisma.usuario.findUnique({ where: { email } });

  if (existe) throw new AppError("E-mail já cadastrado", 409);
  const hash = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({
    data: { nome, email, senha: hash },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });
}


export async function login({ email, senha }) {
  if (!email || !senha) throw new AppError("E-mail e senha são obrigatórios", 400);
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    throw new AppError("Credenciais inválidas", 401);
  }
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "8h" });
  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}

export async function perfil(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });
  if (!usuario) throw new AppError("Usuário não encontrado", 404);
  return usuario;
}