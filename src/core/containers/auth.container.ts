import AuthController from "../../modules/auth/controllers/auth.controller"
import buildAuthRouter from "../../modules/auth/routes/auth.route";
import { AuthService } from "../../modules/auth/services/implementation/auth.service";
import { UserRepository } from "../domain/repositories/implementation/user.repository"
import UserSchema from '../infrastructure/user.schema';

export const buildAuthContainer = () => {
    const userRepository = new UserRepository(UserSchema);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);
    return buildAuthRouter(authController);
}