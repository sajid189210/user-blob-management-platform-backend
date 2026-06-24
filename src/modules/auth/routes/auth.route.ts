import { Router } from 'express';
import { ROUTE_PATHS } from '../../../core/domain/constants/routes';
import AuthController from '../controllers/auth.controller';


const buildAuthRouter = (authController: AuthController) => {
    const authRouter = Router();

    authRouter.post(ROUTE_PATHS.AUTH.SIGNUP, (req, res, next) => authController.signup(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.LOGIN, (req, res, next) => authController.login(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.REFRESH_TOKEN, (req, res, next) => authController.validateRefreshToken(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.LOGOUT, (req, res, next) => authController.logout(req, res, next));

    return authRouter;
}

export default buildAuthRouter;