import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface ITokenService {
    generateAccessToken(userId: string, email: string): string;
    generateRefreshToken(userId: string, email: string): string;
    verifyAccessToken(token: string): IJwtPayload;
    verifyRefreshToken(token: string): IJwtPayload;
}
