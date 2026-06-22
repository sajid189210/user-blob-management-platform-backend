import { AuthController } from "../controllers/auth.controller"
import buildAuthRouter from "../routes/auth.route";
import { AuthService } from "../services/auth.service"
import { UserRepository } from "../repositories/user.repository"
import UserSchema from "../schema/user.schema"

export const buildAuthContainer = () => {
    const userRepository = new UserRepository(UserSchema);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);
    return buildAuthRouter(authController);
}