
export interface IUser {
    email: string;
    password?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}