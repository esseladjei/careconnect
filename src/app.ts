import 'reflect-metadata';
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import errorHandler from './error.js';
import PractitionerRoute from './controllers/practitioner.router.js';
import ClientRoute from './controllers/client.router.js';
import AppointmentRoute from './controllers/appointment.router.js';
import HealthLogRoute from './controllers/healthlog.router.js';
import InsuranceRoute from './controllers/insurance.router.js'; 
import ProviderRoute from './controllers/insuranceprovider.router.js';

const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));

//route definitions
app.use('/api', PractitionerRoute);
app.use('/api', ClientRoute);
app.use('/api', AppointmentRoute);
app.use('/api', HealthLogRoute);
app.use('/api', InsuranceRoute)
app.use('/api', ProviderRoute);

app.get('/', (req: Request, res: Response) => {
   res.send('Welcome to CareConnect API');
});
//404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({message:'Not found'})
  // next(createHttpError(404, 'Not found'));
});
app.use(errorHandler);
export default app;
