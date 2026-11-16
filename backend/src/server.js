import "dotenv/config";
import { app } from "./app.js";

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error("Defina JWT_SECRET e DATABASE_URL no arquivo .env");
  process.exit(1);
}

const porta = process.env.PORT ?? 3000;

app.listen(porta, () => console.log(`API rodando em http://localhost:${porta}`));
