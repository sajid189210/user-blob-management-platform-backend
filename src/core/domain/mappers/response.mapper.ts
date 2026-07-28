import type { Response } from "express";
import IResponse from "../interface/response.interface"
import StatusCode from "../../enums/status-codes";

export const successResponse = (message: string, data: unknown = null): IResponse<unknown> => {
    return {
        data,
        message
    }
}

export const errorResponse = (res: Response, statusCode: number = StatusCode.INTERNAL_SERVER_ERROR, error: unknown, defaultMessage?: string): void => {
    const message = error instanceof Error ? error.message : (defaultMessage ?? 'Something went wrong');
    res.status(statusCode).json({ message });
};
