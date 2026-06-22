import jwt from 'jsonwebtoken';
import { IAuthService } from '../interface/authService.interface';
import { IJwtPayload } from '../middleware/auth.middleware';

export class AuthService implements IAuthService {
    private REFRESH_SECRET;
    private REFRESH_EXPIRY;
    private ACCESS_SECRET;
    private ACCESS_EXPIRY;

    constructor() {
        this.REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_token_secret';
        this.ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'jwt_access_token_secret';
        this.ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
        this.REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    }

    generateAccessToken(userId: string, email: string): string {
        return jwt.sign(
            { userId, email },
            this.ACCESS_SECRET,
            { expiresIn: this.ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] }
        );
    }

    generateRefreshToken(userId: string, email: string): string {
        return jwt.sign(
            { userId, email },
            this.REFRESH_SECRET,
            {
                expiresIn: this.REFRESH_EXPIRY as jwt.SignOptions['expiresIn']
            }
        );
    }

    verifyRefreshToken(token: string): IJwtPayload {
        return jwt.verify(token, this.REFRESH_SECRET) as IJwtPayload;
    }

    isValidCredentials(email: string, password: string): boolean {
        return 
    }
}