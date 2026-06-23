import { model, Schema } from "mongoose";
import { IPostDocument } from '../domain/interface/post.interface';

const PostSchema = new Schema<IPostDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        body: {
            type: String,
            required: [true, 'Body is required'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Post = model<IPostDocument>('Post', PostSchema);
export default Post;
