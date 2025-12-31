import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Threadless API - MVP Backend',
    version: '0.1.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Threadless API rodando em http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV}`);
});

export default app;