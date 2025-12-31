import { Router } from 'express';
import { AboutController } from '../controllers/aboutController';

const router = Router();
const aboutController = new AboutController();

// Rota pública (não requer autenticação)
router.get('/', (req, res) => aboutController.getAbout(req, res));

export default router;