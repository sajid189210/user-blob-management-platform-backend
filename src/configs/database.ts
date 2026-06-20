import mongoose from 'mongoose';

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