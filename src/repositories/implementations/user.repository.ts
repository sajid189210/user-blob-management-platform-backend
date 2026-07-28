import { Model } from "mongoose";
import { IUserDocument } from "../../core/domain/interface/user.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor(private readonly _userModel: Model<IUserDocument>) {
        super(_userModel);
    }

    async findUserByEmail(email: string): Promise<IUserDocument | null> {
        return await this._userModel.findOne({ email }).select('+password');
    }

    async createUser(name: string, email: string, password: string): Promise<IUserDocument> {
        return await this._userModel.create({ name, email, password });
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