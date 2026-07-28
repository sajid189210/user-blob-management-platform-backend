import { ITokenService } from '../../../../core/services/interfaces/token-service.interface';
import { ILoginResponse, IUser, IUserResponse } from '../../../../core/domain/interface/user.interface';
import userMapper from '../../../../core/domain/mappers/user.mapper';
import { IUserRepository } from '../../../../repositories/interfaces/user-repository.interface';
import { IAuthService } from '../interface/auth-service.interface';

export class AuthService implements IAuthService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _tokenService: ITokenService,
    ) {}

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

        const accessToken = this._tokenService.generateAccessToken(user.id, user.email);
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.email);

        return {
            user,
            accessToken,
            refreshToken,
        }
    }
}