import { IJwtPayload } from "../../../../core/middleware/auth.middleware";
import { ILoginResponse, IUser, IUserResponse } from "../../../../core/domain/interface/user.interface";

export interface IAuthService {
    generateAccessToken(userId: string, email: string): string;
    generateRefreshToken(userId: string, email: string): string;
    verifyRefreshToken(token: string): IJwtPayload;

    findUserByEmail(email: string): Promise<IUser | null>;
    getUserResponseByEmail(email: string): Promise<IUserResponse | null>;
    login(email: string, password: string): Promise<ILoginResponse | null>;
    signup(name: string, email: string, password: string): Promise<IUserResponse | null>;
}