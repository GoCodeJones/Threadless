import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import connectionRoutes from './connection.routes';
import trustRoutes from './trust.routes';
import commentRoutes from './comment.routes';
import feedRoutes from './feed.routes';
import profileRoutes from './profile.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/connections', connectionRoutes);
router.use('/trust', trustRoutes);
router.use('/comments', commentRoutes);
router.use('/feed', feedRoutes);
router.use('/profile', profileRoutes);

export default router;