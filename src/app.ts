import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import { buildAuthContainer } from './containers/auth.container';

dotenv.config();

const app = express();
app.use(helmet());

app.use(cookieParser());
app.use(express.json());

const authRouter = buildAuthContainer();

app.use('/api', authRouter);

app.use(errorHandler);

export default app;
