import { Router } from "express";
import AuthController from "../../modules/auth/controllers/auth.controller"
import buildAuthRouter from "../../modules/auth/routes/auth.route";
import { AuthService } from "../../modules/auth/services/implementation/auth.service";
import { TokenService } from "../services/implementations/token.service";
import { UserRepository } from "../../repositories/implementations/user.repository"
import UserSchema from '../infrastructure/user.schema';

export const buildAuthContainer = (): Router => {
    const userRepository = new UserRepository(UserSchema);
    const tokenService = new TokenService();
    const authService = new AuthService(userRepository, tokenService);
    const authController = new AuthController(authService, tokenService);
    return buildAuthRouter(authController);
}