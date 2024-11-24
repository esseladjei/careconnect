import { AddAppointment, DeleteAppointment, GetAppointmentById, UpdateAppointment } from '@/services/appointment.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from 'src/services/utils.js';
const route = express.Router();

route.post('/appointments', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddAppointment(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/appointments/:appointmentid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { appointmentid } = req.params;
      const apiResults = await DeleteAppointment(appointmentid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/appointments/:appointmentid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { appointmentid } = req.params;
      const apiResults = await UpdateAppointment(req.body, appointmentid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const AppointmentRoute = route;
export default AppointmentRoute;
