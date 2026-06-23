import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadToCloudinary = async (buffer: Buffer, folder: string = 'draftpad'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
            }
        );
        stream.end(buffer);
    });
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
    const publicId = url.split('/').pop()?.split('.')[0];
    if (publicId) {
        await cloudinary.uploader.destroy(`draftpad/${publicId}`);
    }
};

export default cloudinary;
