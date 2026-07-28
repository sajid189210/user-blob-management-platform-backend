import { IUser, IUserResponse } from "../../../../core/domain/interface/user.interface";
import { ILoginResponse } from "../../../../core/domain/interface/user.interface";

export interface IAuthService {
    findUserByEmail(email: string): Promise<IUser | null>;
    getUserResponseByEmail(email: string): Promise<IUserResponse | null>;
    login(email: string, password: string): Promise<ILoginResponse | null>;
    signup(name: string, email: string, password: string): Promise<IUserResponse | null>;
}