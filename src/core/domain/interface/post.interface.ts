import { Document, Types } from "mongoose";

export interface IPost {
    title: string;
    body: string;
    imageUrl?: string;
    tags: string[];
    status: PostStatusType;
    author: string;
    likes: number;
}

export interface IPostDocument extends Omit<IPost, 'author'>, Document {
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPostResponse {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    tags: string[];
    status: PostStatusType;
    author: string;
    authorEmail?: string;
    authorName?: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

export type PostStatusType = 'draft' | 'published';
