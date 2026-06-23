import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler } from './core/middleware/error.middleware';
import { buildAuthContainer } from './core/containers/auth.container';
import { buildPostContainer } from './core/containers/post.container';

const app = express();
app.use(helmet());

const ALLOWED_URLS: string[] = (process.env.ALLOWED_URLS || '')
    .split(',')
    .map(url => url.trim());

app.use(cors({
    origin: ALLOWED_URLS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

const authRouter = buildAuthContainer();
const postRouter = buildPostContainer();

app.use('/api', authRouter);
app.use('/api', postRouter);

app.use(errorHandler);

export default app;
