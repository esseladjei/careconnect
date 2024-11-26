import { AddClient, DeleteClient, GetClientAppointmentsById, GetClientById, UpdateClient } from '@/services/client.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from 'src/services/utils.js';
const route = express.Router();

route.post('/clients', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddClient(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/clients/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await GetClientById(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/clients/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await DeleteClient(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/clients/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await UpdateClient(req.body, clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/clientappointments/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await GetClientAppointmentsById(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const ClientRoute = route;
export default ClientRoute;
