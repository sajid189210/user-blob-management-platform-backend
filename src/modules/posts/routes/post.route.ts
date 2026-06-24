import { Router, Request, Response, NextFunction } from 'express';
import { ROUTE_PATHS } from '../../../core/domain/constants/routes';
import PostController from '../controller/post.controller';
import upload from '../../../core/middleware/upload.middleware';
import { authMiddleware } from '../../../core/middleware/auth.middleware';

const buildPostRoutes = (postController: PostController) => {
    const postRouter = Router();

    postRouter.get(ROUTE_PATHS.POST.PUBLISHED, (req: Request, res: Response, next: NextFunction) => postController.getAllPublishedPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.POST.SEARCH, (req: Request, res: Response, next: NextFunction) => postController.searchPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.POST.GET_BY_AUTHOR, (req: Request, res: Response, next: NextFunction) => postController.getPostsByAuthorId(req, res, next));

    postRouter.get(ROUTE_PATHS.LIKED.ROOT, authMiddleware, (req: Request, res: Response, next: NextFunction) => postController.getLikedPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.LIKED.IDS, authMiddleware, (req: Request, res: Response, next: NextFunction) => postController.getLikedIds(req, res, next));
    postRouter.post(ROUTE_PATHS.LIKED.TOGGLE, authMiddleware, (req: Request, res: Response, next: NextFunction) => postController.toggleLike(req, res, next));

    postRouter.get(ROUTE_PATHS.POST.GET_BY_ID, (req: Request, res: Response, next: NextFunction) => postController.getPostById(req, res, next));
    postRouter.post(ROUTE_PATHS.POST.CREATE, authMiddleware, upload.single('image'), (req: Request, res: Response, next: NextFunction) => postController.createPost(req, res, next));
    postRouter.put(ROUTE_PATHS.POST.UPDATE, authMiddleware, upload.single('image'), (req: Request, res: Response, next: NextFunction) => postController.updatePost(req, res, next));
    postRouter.delete(ROUTE_PATHS.POST.DELETE, authMiddleware, (req: Request, res: Response, next: NextFunction) => postController.deletePost(req, res, next));

    return postRouter;
}

export default buildPostRoutes;
