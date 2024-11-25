import { AddHealthLog, DeleteHealthLog, GetHealthLogById, GetHealthLogsById, UpdateHealthLog } from '@/services/clienthealthlog.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from 'src/services/utils.js';
const route = express.Router();

route.post('/healthlogs', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddHealthLog(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/healthlog/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await GetHealthLogById(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/healthlogs/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await GetHealthLogsById(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/healthlogs/:clientid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { clientid } = req.params;
      const apiResults = await DeleteHealthLog(clientid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/healthlogs/:logid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { logid } = req.params;
      const apiResults = await UpdateHealthLog(req.body, logid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const HealthLogRoute = route;
export default HealthLogRoute;
