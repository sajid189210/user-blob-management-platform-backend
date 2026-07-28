import { Document } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password?: string;
    liked: string[];
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
}

export interface ILoginResponse {
    user: IUserResponse;
    accessToken: string;
    refreshToken: string;
}