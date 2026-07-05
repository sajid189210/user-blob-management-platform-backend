import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoUrl = process.env.MONGO_URL;
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoUrl!);
        console.warn('MongoDB connected');
    } catch (error) {
        console.warn('MongoDB connection error:', error);
    }
};

export default connectDB;