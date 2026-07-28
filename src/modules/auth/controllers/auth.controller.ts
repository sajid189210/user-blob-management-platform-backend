import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../services/interface/auth-service.interface";
import { ITokenService } from "../../../core/services/interfaces/token-service.interface";
import StatusCode from "../../../core/enums/status-codes";
import { successResponse, errorResponse } from "../../../core/domain/mappers/response.mapper";

class AuthController {
    constructor(
        private _authService: IAuthService,
        private _tokenService: ITokenService,
    ) { }

    private setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    private clearRefreshTokenCookie(res: Response): void {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
    }

    async signup(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const { name, email, password } = req.body;

        const result = await this._authService.signup(name, email, password);
        if (!result) {
            res.status(StatusCode.CONFLICT).json(errorResponse(null, 'Email already in use'));
            return;
        }

        res.status(StatusCode.CREATED).json(successResponse('Account created successfully.'));
    }

    async validateRefreshToken(req: Request, res: Response, _next: NextFunction): Promise<void> {
        try {
            const token = req.cookies['refresh_token'];
            if (!token) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Session expired. Please log in again.'));
                return;
            }

            const payload = this._tokenService.verifyRefreshToken(token);
            const user = await this._authService.findUserByEmail(payload.email);
            if (!user) {
                res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'User not found'));
                return;
            }

            const accessToken = this._tokenService.generateAccessToken(payload.userId, user.email);
            const refreshToken = this._tokenService.generateRefreshToken(payload.userId, user.email);

            this.setRefreshTokenCookie(res, refreshToken);

            const userData = await this._authService.getUserResponseByEmail(payload.email);

            res.status(StatusCode.OK).json(successResponse('Token refreshed', {
                user: userData,
                accessToken,
            }));
        } catch {
            res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Session expired. Please log in again.'));
        }
    }

    async logout(req: Request, res: Response, _next: NextFunction): Promise<void> {
        this.clearRefreshTokenCookie(res);
        res.status(StatusCode.OK).json(successResponse('Logged out successfully'));
    }

    async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const { email, password } = req.body;

        const result = await this._authService.login(email, password);
        if (!result) {
            res.status(StatusCode.UNAUTHORIZED).json(errorResponse(null, 'Invalid email or password'));
            return;
        }

        if (!result.accessToken || !result.refreshToken) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse(null, 'Something went wrong.'));
            return;
        }

        this.setRefreshTokenCookie(res, result.refreshToken);

        res.status(StatusCode.OK).json(successResponse('Login successful', {
            user: result.user,
            accessToken: result.accessToken,
        }));
    }
}

export default AuthController;
