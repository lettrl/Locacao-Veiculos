import * as veiculoService from "../services/veiculo.service.js";

export async function criar(req, res) {
  const veiculo = await veiculoService.criar(req.body ?? {});
  res.status(201).json(veiculo);
}

export async function listar(req, res) {
  const veiculos = await veiculoService.listar(req.query.disponiveis === "true");
  res.json(veiculos);
}
