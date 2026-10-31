import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function criar({ marca, modelo, placa, ano, valorDiaria }) {
  if (!marca || !modelo || !placa || !ano || valorDiaria === undefined) {
    throw new AppError("Todos os campos são obrigatórios", 400);
  }
  const valor = Number(valorDiaria);

  if (!(valor > 0)) throw new AppError("O valor da diária deve ser positivo", 400);
  const anoNum = Number(ano);

  if (!Number.isInteger(anoNum) || anoNum < 1900) throw new AppError("Ano inválido", 400);
  const placaNorm = String(placa).toUpperCase().trim();
  const existe = await prisma.veiculo.findUnique({ where: { placa: placaNorm } });
  
  if (existe) throw new AppError("Placa já cadastrada", 409);
  return prisma.veiculo.create({
    data: { marca, modelo, placa: placaNorm, ano: anoNum, valorDiaria: valor },
  });
}

export function listar(apenasDisponiveis) {
  return prisma.veiculo.findMany({
    where: apenasDisponiveis ? { disponivel: true } : {},
    orderBy: { id: "desc" },
  });
}