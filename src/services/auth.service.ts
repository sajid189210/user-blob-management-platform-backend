import jwt from 'jsonwebtoken';
import { IAuthService } from '../interface/authService.interface';
import { IJwtPayload } from '../middleware/auth.middleware';
import { IUserRepository } from '../interface/repository.interface';
import { IUser } from '../interface/user.interface';
import { userMapper } from '../mappers/user.mapper';

export class AuthService implements IAuthService {
    private REFRESH_SECRET;
    private REFRESH_EXPIRY;
    private ACCESS_SECRET;
    private ACCESS_EXPIRY;

    constructor(
        private readonly _userRepository: IUserRepository,
    ) {
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

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await this._userRepository.findUserByEmail(email);
    }

    async login(email: string, password: string) {
        const userDoc = await this._userRepository.findUserByEmail(email);
        if (!userDoc) return null;

        const isMatch = await userDoc.comparePassword(password);
        if (!isMatch) return null;

        const accessToken = this.generateAccessToken(userDoc._id.toString(), userDoc.email);
        const refreshToken = this.generateRefreshToken(userDoc._id.toString(), userDoc.email);

        return {
            user: userMapper(userDoc),
            accessToken,
            refreshToken,
        };
    }
}