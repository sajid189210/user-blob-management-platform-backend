import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { IJwtPayload } from "../services/interfaces/token-service.interface";
import { errorResponse } from "../domain/mappers/response.mapper";

export { IJwtPayload };

export interface IAuthRequest extends Request {
    user?: IJwtPayload;
}

export const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        errorResponse(res, 401, null, "No token provided");
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? 'jwt_access_token_secret') as IJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        errorResponse(res, 401, null, "Invalid or expired token");
    }
}