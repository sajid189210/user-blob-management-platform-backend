import { IPostDocument } from "../../interface/post.interface";

export interface IPostRepository {
    createPost(data: Partial<IPostDocument>): Promise<IPostDocument>;
    getAllPosts(): Promise<IPostDocument[]>;
    getAllPublishedPosts(): Promise<IPostDocument[]>;
    searchPublishedPosts(query: string): Promise<IPostDocument[]>;
    getPostsByAuthorId(authorId: string): Promise<IPostDocument[]>;
    getPostById(id: string): Promise<IPostDocument | null>;
    updatePost(id: string, data: Partial<IPostDocument>): Promise<IPostDocument | null>;
    deletePost(id: string): Promise<IPostDocument | null>;
    getPostsByIds(ids: string[]): Promise<IPostDocument[]>;
    incrementLikes(postId: string): Promise<IPostDocument | null>;
    decrementLikes(postId: string): Promise<IPostDocument | null>;
}
