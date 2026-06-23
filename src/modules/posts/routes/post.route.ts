import { Router } from 'express';
import { ROUTE_PATHS } from '../../../core/domain/constants/routes';
import PostController from '../controller/post.controller';
import upload from '../../../core/middleware/upload.middleware';

const buildPostRoutes = (postController: PostController) => {
    const postRouter = Router();

    postRouter.get(ROUTE_PATHS.POST.ROOT, (req, res, next) => postController.getAllPosts(req, res, next));
    postRouter.get(ROUTE_PATHS.POST.GET_BY_ID, (req, res, next) => postController.getPostById(req, res, next));
    postRouter.post(ROUTE_PATHS.POST.CREATE, upload.single('image'), (req, res, next) => postController.createPost(req, res, next));
    postRouter.put(ROUTE_PATHS.POST.UPDATE, upload.single('image'), (req, res, next) => postController.updatePost(req, res, next));
    postRouter.delete(ROUTE_PATHS.POST.DELETE, (req, res, next) => postController.deletePost(req, res, next));

    return postRouter;
}

export default buildPostRoutes;
