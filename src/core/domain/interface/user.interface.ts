import { Document } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password?: string;
    liked: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
}