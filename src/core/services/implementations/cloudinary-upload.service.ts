import { uploadToCloudinary, deleteFromCloudinary } from '../../configs/cloudinary';
import { IUploadService } from '../interfaces/upload-service.interface';

export class CloudinaryUploadService implements IUploadService {
    async upload(buffer: Buffer, folder: string = 'draftpad'): Promise<string> {
        return uploadToCloudinary(buffer, folder);
    }

    async delete(url: string): Promise<void> {
        return deleteFromCloudinary(url);
    }
}