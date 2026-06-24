import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../../../core/middleware/auth.middleware';
import { IUser, IUserResponse } from '../../../../core/domain/interface/user.interface';
import userMapper from '../../../../core/domain/mappers/user.mapper';
import { IUserRepository } from '../../../../core/domain/repositories/interface/user-repository.interface';
import { IAuthService } from '../interface/auth-service.interface';

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

    async getUserResponseByEmail(email: string): Promise<IUserResponse | null> {
        const userDoc = await this._userRepository.findUserByEmail(email);
        if (!userDoc) return null;
        return userMapper(userDoc);
    }

    async signup(name: string, email: string, password: string): Promise<IUserResponse | null> {
        const existing = await this._userRepository.findUserByEmail(email);
        if (existing) return null;

        const userDoc = await this._userRepository.createUser(name, email, password);
        return userMapper(userDoc);
    }

    async login(email: string, password: string) {
        const userDoc = await this._userRepository.findUserByEmail(email);
        if (!userDoc) return null;

        const isMatch = await userDoc.comparePassword(password);
        if (!isMatch) return null;

        const user = userMapper(userDoc);

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id, user.email);

        return {
            user,
            accessToken,
            refreshToken,
        }
    }
}