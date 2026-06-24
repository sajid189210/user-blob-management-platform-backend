import { IPostRepository } from "../../../../core/domain/repositories/interface/post-repository.interface";
import { IPostResponse, PostStatusType } from "../../../../core/domain/interface/post.interface";
import { postMapper, postDocumentMapper } from "../../../../core/domain/mappers/post.mapper";
import { IPostService } from "../interface/post-service.interface";
import { IUserRepository } from "../../../../core/domain/repositories/interface/user-repository.interface";
import { uploadToCloudinary } from "../../../../core/configs/cloudinary";

export class PostService implements IPostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _userRepository: IUserRepository,
    ) { }

    async createPost(data: { title: string; body: string; tags: string; status: PostStatusType; author: string }, file: Express.Multer.File): Promise<IPostResponse> {
        let imageUrl = '';

        try {
            imageUrl = await uploadToCloudinary(file.buffer);
        } catch (err: any) {
            throw new Error('Image upload failed: ' + (err.message || 'Unknown error'));
        }

        const tags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];

        const postDoc = await this._postRepository.createPost(
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

    async getPostsByAuthorId(authorId: string): Promise<IPostResponse[]> {
        const docs = await this._postRepository.getPostsByAuthorId(authorId);
        return (docs ?? []).map(postMapper);
    }

    async getPostById(id: string): Promise<IPostResponse | null> {
        const doc = await this._postRepository.getPostById(id);
        return doc ? postMapper(doc) : null;
    }

    async updatePost(id: string, data: Partial<{ title: string; body: string; imageUrl: string; tags: string[]; status: string }>): Promise<IPostResponse | null> {
        const updateData: any = { ...data };
        if (updateData.status) {
            updateData.status = updateData.status as 'draft' | 'published';
        }
        const doc = await this._postRepository.updatePost(id, updateData);
        return doc ? postMapper(doc) : null;
    }

    async deletePost(id: string): Promise<IPostResponse | null> {
        const doc = await this._postRepository.deletePost(id);
        return doc ? postMapper(doc) : null;
    }

    async toggleLike(userId: string, postId: string): Promise<{ liked: boolean; likedIds: string[]; likes: number }> {
        const user = await this._userRepository.findUserById(userId);
        if (!user) throw new Error('User not found');

        const likedIds = (user.liked || []).map(f => f.toString());
        const isLiked = likedIds.includes(postId);

        let updatedPost: any;
        if (isLiked) {
            await this._userRepository.removeLiked(userId, postId);
            updatedPost = await this._postRepository.decrementLikes(postId);
        } else {
            await this._userRepository.addLiked(userId, postId);
            updatedPost = await this._postRepository.incrementLikes(postId);
        }

        const updatedUser = await this._userRepository.findUserById(userId);
        const updatedLiked = (updatedUser?.liked || []).map(f => f.toString());

        return { liked: !isLiked, likedIds: updatedLiked, likes: updatedPost?.likes ?? 0 };
    }

    async getLikedPosts(userId: string): Promise<IPostResponse[]> {
        const user = await this._userRepository.findUserById(userId);
        if (!user) return [];

        const likedIds = (user.liked || []).map(f => f.toString());
        if (likedIds.length === 0) return [];

        const docs = await this._postRepository.getPostsByIds(likedIds);
        return (docs ?? []).map(postMapper);
    }

    async getLikedIds(userId: string): Promise<string[]> {
        const user = await this._userRepository.findUserById(userId);
        return (user?.liked || []).map(f => f.toString());
    }
}
