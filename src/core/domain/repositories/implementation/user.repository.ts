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
}