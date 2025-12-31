import { Router } from 'express';
import { TrustController } from '../controllers/trustController';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const trustController = new TrustController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Ver meu trust score
router.get('/me', (req, res) => trustController.getMyTrustScore(req, res));

// Ver trust score de outro usuário
router.get('/user/:userId', (req, res) => trustController.getUserTrustScore(req, res));

// Atualizar meu trust score
router.post('/update', (req, res) => trustController.updateMyTrustScore(req, res));

// Recalcular todos (apenas admin)
router.post('/recalculate-all', requireAdmin, (req, res) => trustController.recalculateAll(req, res));

export default router;