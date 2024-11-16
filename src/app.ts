import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { UserRoute } from './controllers/users.router.js';
import { User } from './entities/Users.js';
const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

//route definitions
app.use('/api', UserRoute);

export default app;
