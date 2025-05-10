import express from 'express';
import { registerRoutes } from './_lib/routes'; // Ajustado para o novo local
// import { setupVite, serveStatic, log } from "./vite"; // Removido - não mais necessário aqui

const app = express();

// Middlewares padrão do Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de logging (opcional, mas pode ser útil para depuração no Vercel)
// Este é um exemplo simplificado. O middleware original de server/index.ts era mais complexo.
// Poderíamos reintroduzi-lo ou usar as ferramentas de logging do Vercel.
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  res.on("finish", () => {
    console.log(`[API] ${req.method} ${req.path} - Status ${res.statusCode}`);
  });
  next();
});

// Registrar as rotas da aplicação
registerRoutes(app);

// Tratamento de erro global (opcional mas recomendado)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[API Error]", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Exportar o app Express para o Vercel manipular como Serverless Function
export default app; 