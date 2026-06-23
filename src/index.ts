import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './core/configs/database'

const port = process.env.PORT || 5000;
const bootstrap = async () => {
    await connectDB()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

bootstrap();
