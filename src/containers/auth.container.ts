import { AuthController } from "../controllers/auth.controller"
import buildAuthRouter from "../routes/auth.route";
import { AuthService } from "../services/auth.service"

export const buildAuthContainer = () => {
    const authService = new AuthService();
    const authController = new AuthController(authService);
    return buildAuthRouter(authController);
}