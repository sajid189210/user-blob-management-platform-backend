import { IJwtPayload } from "../middleware/auth.middleware";

export interface IAuthService {
    generateAccessToken(userId: string, email: string): string;
    generateRefreshToken(userId: string, email: string): string;
    verifyRefreshToken(token: string): IJwtPayload;
}