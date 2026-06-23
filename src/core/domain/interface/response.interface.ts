interface IResponse<T = null> {
    data: T;
    message: string;
}

export default IResponse;