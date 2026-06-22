import { Model } from "mongoose";
import { IUserRepository } from "../interface/repository.interface";
import { IUserDocument } from "../interface/user.interface";

export class UserRepository implements IUserRepository {
    constructor(private readonly _userModel: Model<IUserDocument>) { }

    async findUserByEmail(email: string): Promise<IUserDocument | null> {
        return await this._userModel.findOne({ email }).select('+password');
    }
}