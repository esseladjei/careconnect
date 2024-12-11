import 'reflect-metadata';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import errorHandler from './error.js';
import PractitionerRoute from './controllers/practitioner.router.js';
import ClientRoute from './controllers/client.router.js';
import AppointmentRoute from './controllers/appointment.router.js';
import HealthLogRoute from './controllers/healthlog.router.js';
import InsuranceRoute from './controllers/insurance.router.js';
import ProviderRoute from './controllers/insuranceprovider.router.js';
import AccountsRoute from './controllers/account.router.js';
import jwt from 'jsonwebtoken';
import JwtPayloadCustom from './types/jwt.types.js';
const app: Application = express();

const corsOptions = {
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true, //access-control-allow-credentials:true
   optionSuccessStatus: 200,
};
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
   const authHeader = req.headers['authorization'];
   const token = (authHeader && authHeader.split(' ')[1]) || '';
   if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
   }
   if (process.env?.SESSION_SECRET) {
      jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden:Session expired!' });
         }
         if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
            const user = decoded as JwtPayloadCustom;
            req.user = user; // Attach user payload to request
          return next();
         }
         return res.status(403).json({ message: 'Invalid token payload' });
      });
   }
};
//route definitions
app.use('/api', authenticateToken, PractitionerRoute);
app.use('/api', authenticateToken, ClientRoute);
app.use('/api', authenticateToken, AppointmentRoute);
app.use('/api', authenticateToken, HealthLogRoute);
app.use('/api', authenticateToken, InsuranceRoute);
app.use('/api', authenticateToken, ProviderRoute);
app.use('/account', AccountsRoute);

app.use('/', (req: Request, res: Response) => {
   res.json('Welcome to CareConnect API');
});
//404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(404).json({ message: 'Not found' });
   // next(createHttpError(404, 'Not found'));
});
app.use(errorHandler);
export default app;
