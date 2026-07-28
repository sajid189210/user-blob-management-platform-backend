import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../domain/mappers/response.mapper';
import StatusCode from '../enums/status-codes';

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, source: ValidationSource = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let data: unknown;

        if (source === 'body') {
            data = req.body;
        } else if (source === 'query') {
            data = req.query;
        } else {
            data = req.params;
        }

        const result = schema.safeParse(data);
        if (!result.success) {
            const messages = result.error.issues.map(i => i.message).join(', ');
            res.status(StatusCode.BAD_REQUEST).json(errorResponse(null, messages));
            return;
        }

        if (source === 'body') {
            req.body = result.data;
        } else if (source === 'query') {
            (req as unknown as { query: unknown }).query = result.data;
        } else {
            (req as unknown as { params: unknown }).params = result.data;
        }

        next();
    };
};
