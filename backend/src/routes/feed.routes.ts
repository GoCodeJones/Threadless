import { Router } from 'express';
import { FeedController } from '../controllers/feedController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const feedController = new FeedController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Feed personalizado (conexões + promoted)
router.get('/', (req, res) => feedController.getFeed(req, res));

// Feed público (apenas posts públicos + promoted)
router.get('/public', (req, res) => feedController.getPublicFeed(req, res));

export default router;