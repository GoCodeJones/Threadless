import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Ver meu perfil
router.get('/me', (req, res) => profileController.getMyProfile(req, res));

// Ver perfil de outro usuário
router.get('/user/:userId', (req, res) => profileController.getUserProfile(req, res));

// Atualizar meu perfil
router.put('/me', (req, res) => profileController.updateProfile(req, res));

export default router;