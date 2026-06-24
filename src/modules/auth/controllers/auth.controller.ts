import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../services/interface/auth-service.interface";
import StatusCode from "../../../core/enums/status-codes";
import successResponse from "../../../core/domain/mappers/response.mapper";

class AuthController {
    constructor(private _authService: IAuthService) { }

    async signup(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;

        const result = await this._authService.signup(name, email, password);
        if (!result) {
            res.status(StatusCode.CONFLICT).json({ message: 'Email already in use' });
            return;
        }

        res.status(StatusCode.CREATED).json(successResponse('Account created successfully.'));
    }

    async validateRefreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies['refresh_token'];
            if (!token) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: 'No refresh token provided' });
                return;
            }

            const payload = this._authService.verifyRefreshToken(token);
            const user = await this._authService.findUserByEmail(payload.email);
            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json({ message: 'User not found' });
                return;
            }

            const accessToken = this._authService.generateAccessToken(payload.userId, user.email);
            const refreshToken = this._authService.generateRefreshToken(payload.userId, user.email);

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const userData = await this._authService.getUserResponseByEmail(payload.email);

            res.status(StatusCode.OK).json(successResponse('Token refreshed', {
                user: userData,
                accessToken,
            }));
        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' });
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.status(StatusCode.OK).json(successResponse('Logged out successfully'));
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const result = await this._authService.login(email, password);
        if (!result) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: 'Invalid email or password' });
            return;
        }

        if (!result.accessToken || !result.refreshToken) {
            res.status(StatusCode.INTERNAL_SERVER).json({ message: 'Something went wrong.' });
            return;
        }

        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(StatusCode.OK).json(successResponse('Login successful', {
            user: result.user,
            accessToken: result.accessToken,
        }));
    }
}

export default AuthController;