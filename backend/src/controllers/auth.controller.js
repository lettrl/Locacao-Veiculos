import * as authService from "../services/auth.services.js";

export async function registrar(req, res) {
  const usuario = await authService.registrar(req.body ?? {});
  res.status(201).json(usuario);
}

export async function login(req, res) {
  const sessao = await authService.login(req.body ?? {});
  res.json(sessao);
}

export async function perfil(req, res) {
  const usuario = await authService.perfil(req.usuarioId);
  res.json(usuario);
}
