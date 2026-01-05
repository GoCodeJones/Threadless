import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// Todas as rotas requerem autenticação E admin
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

// Listar todos os usuários
router.get('/users', (req, res) => adminController.getAllUsers(req, res));

// Listar todos os posts
router.get('/posts', (req, res) => adminController.getAllPosts(req, res));

// Deletar post
router.delete('/posts/:id', (req, res) => adminController.deletePost(req, res));

export default router;