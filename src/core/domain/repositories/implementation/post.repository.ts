import { Model } from "mongoose";
import { IPostDocument } from "../../interface/post.interface";
import { IPostRepository } from "../interface/post-repository.interface";

export class PostRepository implements IPostRepository {
    constructor(private readonly _postModel: Model<IPostDocument>) { }

    async createPost(data: Partial<IPostDocument>): Promise<IPostDocument> {
        return await this._postModel.create(data);
    }

    async getAllPosts(): Promise<IPostDocument[]> {
        return await this._postModel.find().sort({ createdAt: -1 }).populate('author', 'name email').lean();
    }

    async getAllPublishedPosts(): Promise<IPostDocument[]> {
        return await this._postModel.find({ status: 'published' }).sort({ createdAt: -1 }).populate('author', 'name email').lean();
    }

    async searchPublishedPosts(query: string): Promise<IPostDocument[]> {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}`, 'i');
        return await this._postModel.find({
            status: 'published',
            $or: [
                { title: regex },
                { body: regex },
                { tags: { $elemMatch: { $regex: regex } } },
            ],
        }).sort({ createdAt: -1 }).populate('author', 'name email').lean();
    }

    async getPostsByAuthorId(authorId: string): Promise<IPostDocument[]> {
        return await this._postModel.find({ author: authorId }).sort({ createdAt: -1 }).populate('author', 'name email').lean();
    }

    async getPostById(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findById(id).populate('author', 'name email').lean();
    }

    async updatePost(id: string, data: Partial<IPostDocument>): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name email').lean();
    }

    async deletePost(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndDelete(id);
    }

    async getPostsByIds(ids: string[]): Promise<IPostDocument[]> {
        return await this._postModel.find({ _id: { $in: ids } }).sort({ createdAt: -1 }).populate('author', 'name email').lean();
    }

    async incrementLikes(postId: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true }).populate('author', 'name email').lean();
    }

    async decrementLikes(postId: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true }).populate('author', 'name email').lean();
    }
}
