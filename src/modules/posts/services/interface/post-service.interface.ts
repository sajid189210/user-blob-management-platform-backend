import { ICreatePostData, IPostResponse, IToggleLikeResponse, IUpdatePostData } from "../../../../core/domain/interface/post.interface";

export interface IPostService {
    createPost(data: ICreatePostData, file: Express.Multer.File): Promise<IPostResponse>;
    getAllPublishedPosts(): Promise<IPostResponse[]>;
    searchPublishedPosts(query: string): Promise<IPostResponse[]>;
    getPostsByAuthorId(authorId: string): Promise<IPostResponse[]>;
    getPostById(id: string): Promise<IPostResponse | null>;
    updatePost(id: string, data: Partial<IUpdatePostData>): Promise<IPostResponse | null>;
    deletePost(id: string): Promise<IPostResponse | null>;
    toggleLike(userId: string, postId: string): Promise<IToggleLikeResponse>;
    getLikedPosts(userId: string): Promise<IPostResponse[]>;
    getLikedIds(userId: string): Promise<string[]>;
}
