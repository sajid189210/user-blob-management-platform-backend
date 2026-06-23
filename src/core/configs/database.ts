import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoUrl = process.env.MONGO_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl!);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;