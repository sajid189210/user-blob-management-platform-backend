import { IUserDocument } from "../../interface/user.interface";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<IUserDocument | null>;
    createUser(name: string, email: string, password: string): Promise<IUserDocument>;
    findUserById(userId: string): Promise<IUserDocument | null>;
    addLiked(userId: string, postId: string): Promise<IUserDocument | null>;
    removeLiked(userId: string, postId: string): Promise<IUserDocument | null>;
}