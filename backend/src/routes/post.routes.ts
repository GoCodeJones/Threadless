import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const postController = new PostController();

// Todas as rotas de posts requerem autenticação
router.use(authenticateToken);

// CRUD de posts
router.post('/', (req, res) => postController.create(req, res));
router.get('/my-posts', (req, res) => postController.getMyPosts(req, res));
router.get('/:id', (req, res) => postController.getById(req, res));
router.put('/:id', (req, res) => postController.update(req, res));
router.delete('/:id', (req, res) => postController.delete(req, res));

export default router;