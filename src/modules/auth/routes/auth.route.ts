import { Router, Request, Response, NextFunction } from 'express';
import { ROUTE_PATHS } from '../../../core/domain/constants/routes';
import AuthController from '../controllers/auth.controller';
import { validate } from '../../../core/middleware/validate.middleware';
import { SignupDto, LoginDto } from '../../../core/domain/dto/auth.dto';

const buildAuthRouter = (authController: AuthController): Router => {
    const authRouter = Router();

    authRouter.post(ROUTE_PATHS.AUTH.SIGNUP, validate(SignupDto), (req: Request, res: Response, next: NextFunction) => authController.signup(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.LOGIN, validate(LoginDto), (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.REFRESH_TOKEN, (req: Request, res: Response, next: NextFunction) => authController.validateRefreshToken(req, res, next));
    authRouter.post(ROUTE_PATHS.AUTH.LOGOUT, (req: Request, res: Response, next: NextFunction) => authController.logout(req, res, next));

    return authRouter;
};

export default buildAuthRouter;
