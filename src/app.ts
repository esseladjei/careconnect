import 'reflect-metadata';
import express, { Application } from 'express';
import morgan from 'morgan';
import { UserRoute } from './controllers/users.router.ts';
const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

//route definitions
app.use('/api', UserRoute);

export default app;
