import { z } from 'zod';

export const PostStatus = z.enum(['draft', 'published']);

export const CreatePostDto = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    tags: z.string().optional(),
    status: PostStatus.optional(),
});

export const UpdatePostDto = z.object({
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    tags: z.string().optional(),
    status: PostStatus.optional(),
});

export type CreatePostDtoType = z.infer<typeof CreatePostDto>;
export type UpdatePostDtoType = z.infer<typeof UpdatePostDto>;
