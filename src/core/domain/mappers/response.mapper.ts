import IResponse from "../interface/response.interface"

const successResponse = (message: string, data: any = null): IResponse => {
    return {
        data,
        message
    }
}

export default successResponse;