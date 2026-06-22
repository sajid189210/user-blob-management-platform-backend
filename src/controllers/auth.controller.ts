import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interface/authService.interface";

export class AuthController {
    constructor(private _authService: IAuthService) { }

    async validateAccessToken() {

    }

    async validateRefreshToken(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['refresh_token'];
        if (!token) {
            res.status(401).json({ message: 'No refresh token provided' });
            return;
        }

        const payload = this._authService.verifyRefreshToken(token);
        const user = await this._authService.findUserByEmail(payload.email);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        const accessToken = this._authService.generateAccessToken(payload.userId, user.email);

        res.status(200).json({ accessToken });
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const result = await this._authService.login(email, password);
        if (!result) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            user: result.user,
            accessToken: result.accessToken,
        });
    }
}