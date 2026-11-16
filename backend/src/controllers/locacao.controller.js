import * as locacaoService from "../services/locacao.service.js";

export async function registrar(req, res) {
  const locacao = await locacaoService.registrar(req.usuarioId, req.body ?? {});
  res.status(201).json(locacao);
}

export async function listar(req, res) {
  const locacoes = await locacaoService.listarDoUsuario(req.usuarioId);
  res.json(locacoes);
}

export async function finalizar(req, res) {
  const locacao = await locacaoService.finalizar(req.usuarioId, req.params.id);
  res.json(locacao);
}
