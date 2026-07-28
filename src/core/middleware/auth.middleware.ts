import { NextFunction, Request, Response } from "express";
import { IJwtPayload, ITokenService } from "../services/interfaces/token-service.interface";
import { AppError } from "../errors/app-error";

export { IJwtPayload };

export interface IAuthRequest extends Request {
    user?: IJwtPayload;
}

export const createAuthMiddleware = (tokenService: ITokenService) => {
    return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            next(new AppError(401, "Authentication required"));
            return;
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = tokenService.verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch {
            next(new AppError(401, "Invalid or expired token"));
        }
    };
};