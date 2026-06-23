import { IJwtPayload } from "../../../../core/middleware/auth.middleware";
import { IUser, IUserResponse } from "../../../../core/domain/interface/user.interface";

export interface IAuthService {
    generateAccessToken(userId: string, email: string): string;
    generateRefreshToken(userId: string, email: string): string;
    verifyRefreshToken(token: string): IJwtPayload;

    findUserByEmail(email: string): Promise<IUser | null>;
    login(email: string, password: string): Promise<{
        user: IUserResponse;
        accessToken: string;
        refreshToken: string;
    } | null>;
    signup(name: string, email: string, password: string): Promise<IUserResponse | null>;
}