import type { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";

export interface CustomError extends Error {
    statusCode?: number;
    errors?: unknown;
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = error.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something bad happened.';

    res.status(statusCode).json({
        message,
        ...(error.errors ? { errors: error.errors } : {})
    });
}