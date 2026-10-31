import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const DIA_MS = 24 * 60 * 60 * 1000;

function calcularTotal(valorDiaria, inicio, fim) {
  const diarias = Math.ceil((fim - inicio) / DIA_MS);
  return Number(valorDiaria) * diarias;
}

const incluirVeiculo = {
  veiculo: { select: { id: true, marca: true, modelo: true, placa: true, valorDiaria: true } },
};

export async function registrar(usuarioId, { veiculoId, dataInicio, dataPrevistaDevolucao }) {
  if (!veiculoId || !dataInicio || !dataPrevistaDevolucao) {
    throw new AppError("veiculoId, dataInicio e dataPrevistaDevolucao são obrigatórios", 400);
  }
  const inicio = new Date(dataInicio);
  const fim = new Date(dataPrevistaDevolucao);

  if (isNaN(inicio) || isNaN(fim)) throw new AppError("Datas inválidas", 400);

  if (fim <= inicio) throw new AppError("A data prevista de devolução deve ser posterior ao início", 400);

  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({ where: { id: Number(veiculoId) } });
    if (!veiculo) throw new AppError("Veículo não encontrado", 404);

    const reservado = await tx.veiculo.updateMany({
      where: { id: veiculo.id, disponivel: true },
      data: { disponivel: false },
    });

    if (reservado.count === 0) throw new AppError("Veículo indisponível", 409);

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId: veiculo.id,
        dataInicio: inicio,
        dataPrevistaDevolucao: fim,
        valorTotal: calcularTotal(veiculo.valorDiaria, inicio, fim),
      },
      include: incluirVeiculo,
    });
  });
}

export function listarDoUsuario(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: incluirVeiculo,
    orderBy: { id: "desc" },
  });
}

export async function finalizar(usuarioId, id) {
  return prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findUnique({ where: { id: Number(id) } });

    if (!locacao) throw new AppError("Locação não encontrada", 404);
    
    if (locacao.usuarioId !== usuarioId) throw new AppError("Acesso negado a esta locação", 403);

    const encerrada = await tx.locacao.updateMany({
      where: { id: locacao.id, status: "ATIVA" },
      data: { status: "FINALIZADA", dataDevolucao: new Date() },
    });
    if (encerrada.count === 0) throw new AppError("Locação já finalizada", 409);

    await tx.veiculo.update({ where: { id: locacao.veiculoId }, data: { disponivel: true } });

    return tx.locacao.findUnique({ where: { id: locacao.id }, include: incluirVeiculo });
  });
}