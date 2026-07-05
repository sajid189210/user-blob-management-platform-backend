import { IPostRepository } from "../../../../core/domain/repositories/interface/post-repository.interface";
import { ICreatePostData, IPostDocument, IPostResponse, IToggleLikeResponse, IUpdatePostData } from "../../../../core/domain/interface/post.interface";
import { postMapper, postDocumentMapper } from "../../../../core/domain/mappers/post.mapper";
import { IPostService } from "../interface/post-service.interface";
import { IUserRepository } from "../../../../core/domain/repositories/interface/user-repository.interface";
import { uploadToCloudinary } from "../../../../core/configs/cloudinary";

export class PostService implements IPostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _userRepository: IUserRepository,
    ) { }

    async createPost(data: ICreatePostData, file: Express.Multer.File): Promise<IPostResponse> {
        let imageUrl: string;

        try {
            imageUrl = await uploadToCloudinary(file.buffer);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            throw new Error('Image upload failed: ' + message, { cause: err });
        }

        const tags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];

        const postDoc = await this._postRepository.create(
            postDocumentMapper({
                title: data.title,
                body: data.body,
                imageUrl,
                tags,
                status: data.status,
                author: data.author,
                likes: 0,
            }));
        return postMapper(postDoc);
    }

    async getAllPublishedPosts(): Promise<IPostResponse[]> {
        const docs = await this._postRepository.getAllPublishedPosts();
        return (docs ?? []).map(postMapper);
    }

    async searchPublishedPosts(query: string): Promise<IPostResponse[]> {
        const docs = await this._postRepository.searchPublishedPosts(query);
        return (docs ?? []).map(postMapper);
    }

    async getPostsByAuthorId(authorId: string): Promise<IPostResponse[]> {
        const docs = await this._postRepository.getPostsByAuthorId(authorId);
        return (docs ?? []).map(postMapper);
    }

    async getPostById(id: string): Promise<IPostResponse | null> {
        const doc = await this._postRepository.findById(id);
        return doc ? postMapper(doc) : null;
    }

    async updatePost(id: string, data: Partial<IUpdatePostData>): Promise<IPostResponse | null> {
        const updateData: Record<string, unknown> = { ...data };
        if (typeof updateData.status === 'string') {
            updateData.status = updateData.status as 'draft' | 'published';
        }
        const doc = await this._postRepository.update(id, updateData);
        return doc ? postMapper(doc) : null;
    }

    async deletePost(id: string): Promise<IPostResponse | null> {
        const doc = await this._postRepository.delete(id);
        return doc ? postMapper(doc) : null;
    }

    async toggleLike(userId: string, postId: string): Promise<IToggleLikeResponse> {
        const user = await this._userRepository.findById(userId);
        if (!user) { throw new Error('User not found'); }

        const likedIds = (user.liked || []).map(f => f.toString());
        const isLiked = likedIds.includes(postId);

        let updatedPost: IPostDocument | null;
        if (isLiked) {
            await this._userRepository.removeLiked(userId, postId);
            updatedPost = await this._postRepository.decrementLikes(postId);
        } else {
            await this._userRepository.addLiked(userId, postId);
            updatedPost = await this._postRepository.incrementLikes(postId);
        }

        const updatedUser = await this._userRepository.findById(userId);
        const updatedLiked = (updatedUser?.liked ?? []).map(f => f.toString());

        return { liked: !isLiked, likedIds: updatedLiked, likes: updatedPost?.likes ?? 0 };
    }

    async getLikedPosts(userId: string): Promise<IPostResponse[]> {
        const user = await this._userRepository.findById(userId);
        if (!user) { return []; }

        const likedIds = (user.liked || []).map(f => f.toString());
        if (likedIds.length === 0) { return []; }

        const docs = await this._postRepository.findByIds(likedIds);
        return (docs ?? []).map(postMapper);
    }

    async getLikedIds(userId: string): Promise<string[]> {
        const user = await this._userRepository.findById(userId);
        return (user?.liked ?? []).map(f => f.toString());
    }
}
