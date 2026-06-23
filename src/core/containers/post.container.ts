import PostController from "../../modules/posts/controller/post.controller";
import buildPostRoutes from "../../modules/posts/routes/post.route";
import { PostService } from "../../modules/posts/services/implementation/post.service";
import { PostRepository } from "../domain/repositories/implementation/post.repository";
import PostSchema from '../infrastructure/post.schema';

export const buildPostContainer = () => {
    const postRepository = new PostRepository(PostSchema);
    const postService = new PostService(postRepository);
    const postController = new PostController(postService);
    return buildPostRoutes(postController);
}
