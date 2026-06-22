import bcrypt from 'bcrypt';
import { model, Schema } from "mongoose";
import { IUserDocument } from "../interface/user.interface";

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
                'Please fill a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [4, 'Password must be at least 4 characters long'],
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password || '');
};

const User = model<IUserDocument>('User', UserSchema);
export default User;