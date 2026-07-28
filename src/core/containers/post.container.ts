import PostController from "../../modules/posts/controllers/post.controller";
import buildPostRoutes from "../../modules/posts/routes/post.route";
import { PostService } from "../../modules/posts/services/implementation/post.service";
import { PostRepository } from "../../repositories/implementations/post.repository";
import { UserRepository } from "../../repositories/implementations/user.repository";
import { CloudinaryUploadService } from "../services/implementations/cloudinary-upload.service";
import { Router } from 'express';
import PostSchema from '../infrastructure/post.schema';
import UserSchema from '../infrastructure/user.schema';

export const buildPostContainer = (): Router => {
    const userRepository = new UserRepository(UserSchema);
    const postRepository = new PostRepository(PostSchema);
    const uploadService = new CloudinaryUploadService();
    const postService = new PostService(postRepository, userRepository, uploadService);
    const postController = new PostController(postService);
    return buildPostRoutes(postController);
}
