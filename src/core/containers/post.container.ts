import PostController from "../../modules/posts/controller/post.controller";
import buildPostRoutes from "../../modules/posts/routes/post.route";
import { PostService } from "../../modules/posts/services/implementation/post.service";
import { PostRepository } from "../domain/repositories/implementation/post.repository";
import { UserRepository } from "../domain/repositories/implementation/user.repository";
import PostSchema from '../infrastructure/post.schema';
import UserSchema from '../infrastructure/user.schema';

export const buildPostContainer = () => {
    const userRepository = new UserRepository(UserSchema);
    const postRepository = new PostRepository(PostSchema);
    const postService = new PostService(postRepository, userRepository);
    const postController = new PostController(postService);
    return buildPostRoutes(postController);
}
