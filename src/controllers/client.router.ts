import { AddClient, deleteClient, getClientById, updateClient } from '@/services/client.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from 'src/services/utils.js';
const route = express.Router();

route.post('/practitioners', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddClient(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await getClientById(practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await deleteClient(practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await updateClient(req.body, practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const ClientRoute = route;
export default ClientRoute;
