import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { UserRoute } from './controllers/users.router.ts';
const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

//route definitions
app.use('/api', UserRoute);

app.get('/', (req: Request, res: Response) => {
   res.send('Welcome to CareConnect API');
});
export default app;
