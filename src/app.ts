import 'reflect-metadata';
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import errorHandler from './error.ts';
import { UserRoute } from './controllers/users.router.ts';
const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

//route definitions
app.use('/api', UserRoute);

app.get('/', (req: Request, res: Response) => {
   res.send('Welcome to CareConnect API');
});
//404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
   next(createHttpError(404, 'Not foundd'));
});
app.use(errorHandler);
export default app;
