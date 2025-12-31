import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { createTables } from './config/schema';
import routes from './routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Threadless API - MVP Backend',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (requires token)'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Inicializar banco e servidor
async function startServer() {
  try {
    const db = await initDatabase();
    await createTables(db);
    
    app.listen(PORT, () => {
      console.log(`Threadless API rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
      console.log(`Auth endpoints disponíveis em /api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;