import { AddProvider, DeleteProvider, GetProviderById, UpdateProvider } from '../services/insuranceprovider.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
const route = express.Router();

route.post('/providers', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddProvider(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/providers/:providerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { providerid } = req.params;
      const apiResults = await GetProviderById(providerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/providers/:providerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { providerid } = req.params;
      const apiResults = await DeleteProvider(providerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/providers/:providerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { providerid } = req.params;
      const apiResults = await UpdateProvider(req.body, providerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const ProviderRoute = route;
export default ProviderRoute;
