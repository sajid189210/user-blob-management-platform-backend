import { NextFunction, Response } from "express";
import { IPostService } from "../services/interface/post-service.interface";
import { IUpdatePostData } from "../../../core/domain/interface/post.interface";
import StatusCode from "../../../core/enums/status-codes";
import { successResponse, errorResponse } from "../../../core/domain/mappers/response.mapper";
import { IAuthRequest } from "../../../core/middleware/auth.middleware";
import { CreatePostDtoType, UpdatePostDtoType } from "../../../core/domain/dto/post.dto";

class PostController {
    constructor(private _postService: IPostService) { }

    async createPost(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const { title, body, tags, status } = req.body as CreatePostDtoType;
            const user = req.user;
            const file = req.file;

            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Not authenticated'));
                return;
            }

            if (!file) {
                res.status(StatusCode.BAD_REQUEST).json(errorResponse(null, 'Image is required'));
                return;
            }

            const result = await this._postService.createPost({ title, body, tags: tags ?? '', status: status ?? 'draft', author: user.userId }, file);
            res.status(StatusCode.CREATED).json(successResponse('Post created successfully', result));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async getAllPublishedPosts(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const posts = await this._postService.getAllPublishedPosts();
            res.status(StatusCode.OK).json(successResponse('Published posts fetched successfully', posts));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async searchPosts(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const query = (req.query.q as string) || '';
            if (!query.trim()) {
                res.status(StatusCode.BAD_REQUEST).json(errorResponse(null, 'Search query is required'));
                return;
            }
            const posts = await this._postService.searchPublishedPosts(query);
            res.status(StatusCode.OK).json(successResponse('Search results fetched successfully', posts));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async getPostsByAuthorId(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        const authorId = req.params.authorId as string;
        try {
            const posts = await this._postService.getPostsByAuthorId(authorId);
            res.status(StatusCode.OK).json(successResponse('Posts fetched successfully', posts));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async getPostById(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        const id = req.params.id as string;
        try {
            const post = await this._postService.getPostById(id);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json(errorResponse(null, 'Post not found'));
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post fetched successfully', post));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async updatePost(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        const id = req.params.id as string;
        try {
            const updateData = req.body as UpdatePostDtoType;
            const post = await this._postService.updatePost(id, updateData as Partial<IUpdatePostData>, req.file);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json(errorResponse(null, 'Post not found'));
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post updated successfully', post));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async deletePost(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        const id = req.params.id as string;
        try {
            const post = await this._postService.deletePost(id);
            if (!post) {
                res.status(StatusCode.NOT_FOUND).json(errorResponse(null, 'Post not found'));
                return;
            }
            res.status(StatusCode.OK).json(successResponse('Post deleted successfully'));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async toggleLike(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Not authenticated'));
                return;
            }
            const postId = req.params.id as string;
            const result = await this._postService.toggleLike(user.userId, postId);
            res.status(StatusCode.OK).json(successResponse('Like toggled successfully', result));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async getLikedPosts(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Not authenticated'));
                return;
            }
            const posts = await this._postService.getLikedPosts(user.userId);
            res.status(StatusCode.OK).json(successResponse('Liked posts fetched successfully', posts));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }

    async getLikedIds(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Not authenticated'));
                return;
            }
            const ids = await this._postService.getLikedIds(user.userId);
            res.status(StatusCode.OK).json(successResponse('Liked IDs fetched successfully', ids));
        } catch (error: unknown) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(error));
        }
    }
}

export default PostController;
