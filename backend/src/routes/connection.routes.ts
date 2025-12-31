import { Router } from 'express';
import { ConnectionController } from '../controllers/connectionController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const connectionController = new ConnectionController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Gerar chave de conexão
router.post('/generate-key', (req, res) => connectionController.generateKey(req, res));

// Conectar usando chave
router.post('/connect', (req, res) => connectionController.connectWithKey(req, res));

// Listar minhas conexões
router.get('/my-connections', (req, res) => connectionController.getMyConnections(req, res));

// Verificar se está conectado com alguém
router.get('/check/:userId', (req, res) => connectionController.checkConnection(req, res));

export default router;