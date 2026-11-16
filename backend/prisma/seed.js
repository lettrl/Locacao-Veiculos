import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("senha123", 10);

  await prisma.usuario.upsert({
    where: { email: "demo@locacao.com" },
    update: {},
    create: { nome: "Usuário Demo", email: "demo@locacao.com", senha: senhaHash },
  });

  const veiculos = [
    { marca: "Fiat", modelo: "Mobi", placa: "BRA2E19", ano: 2022, valorDiaria: 89.90 },
    { marca: "Volkswagen", modelo: "Gol", placa: "MER0A01", ano: 2021, valorDiaria: 99.90 },
    { marca: "Chevrolet", modelo: "Onix", placa: "ABC1D23", ano: 2023, valorDiaria: 120.00 },
    { marca: "Toyota", modelo: "Corolla", placa: "XYZ9F88", ano: 2023, valorDiaria: 220.00 },
    { marca: "BMW", modelo: "X5", placa: "PRE1M10", ano: 2024, valorDiaria: 580.00 },
    { marca: "Mercedes-Benz", modelo: "GLE 450", placa: "LUX0G99", ano: 2024, valorDiaria: 850.00 },
  ];

  for (const v of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: v.placa },
      update: {},
      create: v,
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
