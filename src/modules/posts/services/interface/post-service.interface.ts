import { IPostResponse, PostStatusType } from "../../../../core/domain/interface/post.interface";

export interface IPostService {
    createPost(data: { title: string; body: string; tags: string; status: PostStatusType; author: string }, file: Express.Multer.File): Promise<IPostResponse>;
    getAllPosts(): Promise<IPostResponse[]>;
    getPostById(id: string): Promise<IPostResponse | null>;
    updatePost(id: string, data: Partial<{ title: string; body: string; imageUrl: string; tags: string[]; status: string }>): Promise<IPostResponse | null>;
    deletePost(id: string): Promise<IPostResponse | null>;
}
