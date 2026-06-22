import { Router, Request, Response } from 'express';
import { ROUTE_PATHS } from '../constants/routes';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const buildAuthRouter = (authController: AuthController) => {
    const authRouter = Router();

    authRouter.post(ROUTE_PATHS.AUTH.LOGIN, (req, res, next) => authController.login(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.REFRESH_TOKEN, (req, res, next) => authController.validateRefreshToken(req, res, next));

    return authRouter;
}

export default buildAuthRouter;