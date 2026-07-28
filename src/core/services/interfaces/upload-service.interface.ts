export interface IUploadService {
    upload(buffer: Buffer, folder?: string): Promise<string>;
    delete(url: string): Promise<void>;
}