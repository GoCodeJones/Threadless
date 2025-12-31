import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import connectionRoutes from './connection.routes';
import trustRoutes from './trust.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/connections', connectionRoutes);
router.use('/trust', trustRoutes);

export default router;