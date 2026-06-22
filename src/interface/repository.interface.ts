import { IUserDocument } from "./user.interface";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<IUserDocument | null>;
}