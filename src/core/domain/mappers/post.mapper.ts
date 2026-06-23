import { Types } from "mongoose";
import { IPost, IPostDocument, IPostResponse } from "../interface/post.interface";

export const postMapper = (postDocument: IPostDocument): IPostResponse => {
    const author = postDocument.author as any;
    const isPopulated = typeof author === 'object' && author._id;

    return {
        id: postDocument._id.toString(),
        title: postDocument.title,
        body: postDocument.body,
        imageUrl: postDocument.imageUrl,
        tags: postDocument.tags,
        status: postDocument.status,
        author: String(author),
        authorEmail: isPopulated ? author.email : undefined,
        authorName: isPopulated ? author.name : undefined,
        likes: postDocument.likes,
        createdAt: postDocument.createdAt,
        updatedAt: postDocument.updatedAt,
    }
}

export const postDocumentMapper = (entity: IPost): Partial<IPostDocument> => {
    return {
        title: entity.title,
        body: entity.body,
        imageUrl: entity.imageUrl,
        tags: entity.tags,
        status: entity.status,
        author: new Types.ObjectId(entity.author),
        likes: entity.likes,
    }
}
