import { IUserDocument, IUserResponse } from "../interface/user.interface";

export const userMapper = (userDocument: IUserDocument): IUserResponse => {
    return {
        id: userDocument._id.toString(),
        email: userDocument.email,
        createdAt: userDocument.createdAt,
        updatedAt: userDocument.updatedAt,
    }
}