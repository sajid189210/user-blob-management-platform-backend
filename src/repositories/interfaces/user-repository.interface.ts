import { IUserDocument } from "../../core/domain/interface/user.interface";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<IUserDocument> {
    findUserByEmail(email: string): Promise<IUserDocument | null>;
    createUser(name: string, email: string, password: string): Promise<IUserDocument>;
    addLiked(userId: string, postId: string): Promise<IUserDocument | null>;
    removeLiked(userId: string, postId: string): Promise<IUserDocument | null>;
}