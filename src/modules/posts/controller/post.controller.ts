import { NextFunction, Request, Response } from "express";
import { IPostService } from "../services/interface/post-service.interface";
import StatusCode from "../../../core/enums/status-codes";
import successResponse from "../../../core/domain/mappers/response.mapper";
import { uploadToCloudinary } from "../../../core/configs/cloudinary";

class PostController {
    constructor(private _postService: IPostService) { }

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, body, tags, status } = req.body;
            const author = (req as any).user?.userId;
            const file = req.file;

            if (!title) {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Title is required' });
                return;
            }

            if (!body) {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Body is required' });
                return;
            }

            if (!file) {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Image is required' });
                return;
            }

            const result = await this._postService.createPost({ title, body, tags, status, author }, file);
            res.status(StatusCode.CREATED).json(successResponse('Post created successfully', result));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async getAllPublishedPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const posts = await this._postService.getAllPublishedPosts();
            res.status(StatusCode.OK).json(successResponse('Published posts fetched successfully', posts));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async getPostsByAuthorId(req: Request, res: Response, next: NextFunction) {
        const authorId = req.params.authorId as string;
        try {
            const posts = await this._postService.getPostsByAuthorId(authorId);
            res.status(StatusCode.OK).json(successResponse('Posts fetched successfully', posts));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async getPostById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id as string;
        try {
            const post = await this._postService.getPostById(id);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json({ message: 'Post not found' });
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post fetched successfully', post));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id as string;
        try {
            const { title, body, tags, status } = req.body;
            const updateData: any = { title, body, tags, status };

            if (req.file) {
                updateData.imageUrl = await uploadToCloudinary(req.file.buffer);
            }

            const post = await this._postService.updatePost(id, updateData);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json({ message: 'Post not found' });
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post updated successfully', post));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id as string;
        try {
            const post = await this._postService.deletePost(id);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json({ message: 'Post not found' });
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post deleted successfully'));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async toggleLike(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.userId;
            const postId = req.params.id as string;
            const result = await this._postService.toggleLike(userId, postId);
            res.status(StatusCode.OK).json(successResponse('Like toggled successfully', result));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async getLikedPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.userId;
            const posts = await this._postService.getLikedPosts(userId);
            res.status(StatusCode.OK).json(successResponse('Liked posts fetched successfully', posts));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }

    async getLikedIds(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.userId;
            const ids = await this._postService.getLikedIds(userId);
            res.status(StatusCode.OK).json(successResponse('Liked IDs fetched successfully', ids));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: error.message || 'Something went wrong' });
        }
    }
}

export default PostController;
