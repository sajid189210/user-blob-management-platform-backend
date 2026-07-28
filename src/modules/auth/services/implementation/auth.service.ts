import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../../../core/middleware/auth.middleware';
import { ILoginResponse, IUser, IUserResponse } from '../../../../core/domain/interface/user.interface';
import userMapper from '../../../../core/domain/mappers/user.mapper';
import { IUserRepository } from '../../../../repositories/interfaces/user-repository.interface';
import { IAuthService } from '../interface/auth-service.interface';

export class AuthService implements IAuthService {
    private _refreshSecret;
    private _refreshExpiry;
    private _accessSecret;
    private _accessExpiry;

    constructor(
        private readonly _userRepository: IUserRepository,
    ) {
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
            {
                expiresIn: this._refreshExpiry as jwt.SignOptions['expiresIn']
            }
        );
    }

    verifyRefreshToken(token: string): IJwtPayload {
        return jwt.verify(token, this._refreshSecret) as IJwtPayload;
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await this._userRepository.findUserByEmail(email);
    }

    async getUserResponseByEmail(email: string): Promise<IUserResponse | null> {
        const userDoc = await this._userRepository.findUserByEmail(email);
        if (!userDoc) {return null;}
        return userMapper(userDoc);
    }

    async signup(name: string, email: string, password: string): Promise<IUserResponse | null> {
        const existing = await this._userRepository.findUserByEmail(email);
        if (existing) {return null;}

        const userDoc = await this._userRepository.createUser(name, email, password);
        return userMapper(userDoc);
    }

    async login(email: string, password: string): Promise<ILoginResponse | null> {
        const userDoc = await this._userRepository.findUserByEmail(email);
        if (!userDoc) {return null;}

        const isMatch = await userDoc.comparePassword(password);
        if (!isMatch) {return null;}

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