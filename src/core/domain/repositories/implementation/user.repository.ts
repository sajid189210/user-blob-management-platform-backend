import { Model } from "mongoose";
import { IUserDocument } from "../../interface/user.interface";
import { IUserRepository } from "../interface/user-repository.interface";

export class UserRepository implements IUserRepository {
    constructor(private readonly _userModel: Model<IUserDocument>) { }

    async findUserByEmail(email: string): Promise<IUserDocument | null> {
        return await this._userModel.findOne({ email }).select('+password');
    }

    async createUser(name: string, email: string, password: string): Promise<IUserDocument> {
        return await this._userModel.create({ name, email, password });
    }

    async findUserById(userId: string): Promise<IUserDocument | null> {
        return await this._userModel.findById(userId);
    }

    async addLiked(userId: string, postId: string): Promise<IUserDocument | null> {
        return await this._userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { liked: postId } },
            { new: true }
        );
    }

    async removeLiked(userId: string, postId: string): Promise<IUserDocument | null> {
        return await this._userModel.findByIdAndUpdate(
            userId,
            { $pull: { liked: postId } },
            { new: true }
        );
    }
}