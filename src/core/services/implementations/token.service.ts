import jwt from 'jsonwebtoken';
import { ITokenService, IJwtPayload } from '../interfaces/token-service.interface';

export class TokenService implements ITokenService {
    private _refreshSecret: string;
    private _refreshExpiry: string;
    private _accessSecret: string;
    private _accessExpiry: string;

    constructor() {
        this._refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'jwt_refresh_token_secret';
        this._accessSecret = process.env.JWT_ACCESS_SECRET ?? 'jwt_access_token_secret';
        this._accessExpiry = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
        this._refreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
    }

    generateAccessToken(userId: string, email: string): string {
        return jwt.sign(
            { userId, email },
            this._accessSecret,
            { expiresIn: this._accessExpiry as jwt.SignOptions['expiresIn'] }
        );
    }

    generateRefreshToken(userId: string, email: string): string {
        return jwt.sign(
            { userId, email },
            this._refreshSecret,
            { expiresIn: this._refreshExpiry as jwt.SignOptions['expiresIn'] }
        );
    }

    verifyRefreshToken(token: string): IJwtPayload {
        return jwt.verify(token, this._refreshSecret) as IJwtPayload;
    }
}
