import IResponse from "../interface/response.interface"

export const successResponse = (message: string, data: unknown = null): IResponse<unknown> => {
    return {
        data,
        message
    }
}

export const errorResponse = (error: unknown, defaultMessage?: string): { message: string } => {
    const message = error instanceof Error ? error.message : (defaultMessage ?? 'Something went wrong');
    return { message };
};
