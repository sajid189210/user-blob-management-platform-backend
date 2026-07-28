import { IPostDocument } from "../../core/domain/interface/post.interface";
import { IBaseRepository } from "./base-repository.interface";

export interface IPostRepository extends IBaseRepository<IPostDocument> {
    getAllPublishedPosts(): Promise<IPostDocument[]>;
    searchPublishedPosts(query: string): Promise<IPostDocument[]>;
    getPostsByAuthorId(authorId: string): Promise<IPostDocument[]>;
    incrementLikes(postId: string): Promise<IPostDocument | null>;
    decrementLikes(postId: string): Promise<IPostDocument | null>;
}