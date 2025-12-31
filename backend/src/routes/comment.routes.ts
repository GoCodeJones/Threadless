import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const commentController = new CommentController();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Criar comentário
router.post('/', (req, res) => commentController.create(req, res));

// Listar comentários de um post
router.get('/post/:postId', (req, res) => commentController.getByPostId(req, res));

// Deletar comentário
router.delete('/:id', (req, res) => commentController.delete(req, res));

export default router;