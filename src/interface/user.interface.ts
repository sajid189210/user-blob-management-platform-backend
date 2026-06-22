import { Document } from "mongoose";

export interface IUser {
    email: string;
    password?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    id: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}