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

    async getPostById(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findById(id).populate('author', 'name email').lean();
    }

    async updatePost(id: string, data: Partial<IPostDocument>): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndUpdate(id, data, { new: true }).populate('author', 'name email').lean();
    }

    async deletePost(id: string): Promise<IPostDocument | null> {
        return await this._postModel.findByIdAndDelete(id);
    }
}
