import { Router } from 'express';
import { ROUTE_PATHS } from '../../../core/domain/constants/routes';
import PostController from '../controller/post.controller';
import upload from '../../../core/middleware/upload.middleware';
import { authMiddleware } from '../../../core/middleware/auth.middleware';

const buildPostRoutes = (postController: PostController) => {
    const postRouter = Router();

    postRouter.get(ROUTE_PATHS.POST.PUBLISHED, (req, res, next) => postController.getAllPublishedPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.POST.GET_BY_AUTHOR, (req, res, next) => postController.getPostsByAuthorId(req, res, next));

    postRouter.get(ROUTE_PATHS.LIKED.ROOT, authMiddleware, (req, res, next) => postController.getLikedPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.LIKED.IDS, authMiddleware, (req, res, next) => postController.getLikedIds(req, res, next));
    postRouter.post(ROUTE_PATHS.LIKED.TOGGLE, authMiddleware, (req, res, next) => postController.toggleLike(req, res, next));

    postRouter.get(ROUTE_PATHS.POST.GET_BY_ID, (req, res, next) => postController.getPostById(req, res, next));
    postRouter.post(ROUTE_PATHS.POST.CREATE, authMiddleware, upload.single('image'), (req, res, next) => postController.createPost(req, res, next));
    postRouter.put(ROUTE_PATHS.POST.UPDATE, authMiddleware, upload.single('image'), (req, res, next) => postController.updatePost(req, res, next));
    postRouter.delete(ROUTE_PATHS.POST.DELETE, authMiddleware, (req, res, next) => postController.deletePost(req, res, next));

    return postRouter;
}

export default buildPostRoutes;
