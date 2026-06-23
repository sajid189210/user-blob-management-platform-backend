import { IUserDocument, IUserResponse } from "../interface/user.interface";

const userMapper = (userDocument: IUserDocument): IUserResponse => {
    return {
        id: userDocument._id.toString(),
        name: userDocument.name,
        email: userDocument.email,
    }
}
export default userMapper;
