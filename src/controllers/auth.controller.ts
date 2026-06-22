import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interface/authService.interface";

export class AuthController {
    constructor(private _authService: IAuthService) { }

    async validateAccessToken() {

    }

    async validateRefreshToken(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies['refresh_token'];
        if (!token) {
            res.status(401).json({})
        }
        // const payload = this._authService.verifyRefreshToken()
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const body = req.body;
        const { email, password } = body;
        
    }
}