import { Model } from "mongoose";
import { IPostDocument } from "../../core/domain/interface/post.interface";
import { IPostRepository } from "../interfaces/post-repository.interface";
import { BaseRepository } from "./base.repository";

export class PostRepository extends BaseRepository<IPostDocument> implements IPostRepository {
    constructor(private readonly _postModel: Model<IPostDocument>) {
        super(_postModel);
    }

    async findAll(): Promise<IPostDocument[]> {
        return await this._postModel.find().sort({ createdAt: -1 }).populate('author', 'name email');
    }

    async getAllPublishedPosts(): Promise<IPostDocument[]> {
        return await this._postModel.find({ status: 'published' }).sort({ createdAt: -1 }).populate('author', 'name email');
    }

    async searchPublishedPosts(query: string): Promise<IPostDocument[]> {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = '\\b' + escaped;
        return await this._postModel.find({
            status: 'published',
            $or: [
                { title: { $regex: pattern, $options: 'i' } },
                { body: { $regex: pattern, $options: 'i' } },
                { tags: { $elemMatch: { $regex: pattern, $options: 'i' } } },
            ],
        }).sort({ createdAt: -1 }).populate('author', 'name email');
    }

    async getPostsByAuthorId(authorId: string): Promise<IPostDocument[]> {
        return await this._postModel.find({ author: authorId }).sort({ createdAt: -1 }).populate('author', 'name email');
    }

    async findById(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findById(id).populate('author', 'name email');
    }

    async update(id: string, data: Partial<IPostDocument>): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name email');
    }

    async delete(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndDelete(id);
    }

    async findByIds(ids: string[]): Promise<IPostDocument[]> {
        return await this._postModel.find({ _id: { $in: ids } }).sort({ createdAt: -1 }).populate('author', 'name email');
    }

    async incrementLikes(postId: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true }).populate('author', 'name email');
    }

    async decrementLikes(postId: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true }).populate('author', 'name email');
    }
}