import app from './app.js';
import connectDB from './configs/database.js'

const port = process.env.PORT || 5000;
const bootstrap = async () => {
    await connectDB()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

bootstrap();