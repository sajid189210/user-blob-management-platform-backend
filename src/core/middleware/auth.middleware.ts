import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthService } from "../../modules/auth/services/implementation/auth.service";

export interface IJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface IAuthRequest extends Request {
    user?: IJwtPayload;
}

export const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'jwt_access_token_secret') as IJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}