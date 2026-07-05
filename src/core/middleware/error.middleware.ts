import type { NextFunction, Request, Response } from "express";
import multer from 'multer';
import { StatusCode } from "../domain/constants/statusCodes";

export interface ICustomError extends Error {
    statusCode?: number;
    errors?: unknown;
}

const MULTER_MESSAGES: Record<string, string> = {
    LIMIT_FILE_SIZE: 'File is too large. Maximum size is 5MB.',
    LIMIT_UNEXPECTED_FILE: 'Invalid file type. Only JPEG, PNG, WebP and GIF images are allowed.',
};

export const errorHandler = (error: ICustomError, req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof multer.MulterError) {
        res.status(StatusCode.BAD_REQUEST).json({
            message: MULTER_MESSAGES[error.code] || error.message,
        });
        return;
    }

    const statusCode = error.statusCode ?? StatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something bad happened.';

    res.status(statusCode).json({
        message,
        ...(error.errors ? { errors: error.errors } : {})
    });
}