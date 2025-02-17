import { AddPractitionerFee, DeletePractitionerFee, UpdatePractitionerFee } from '../services/practitionerfee.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
const route = express.Router();

route.post('/practitionerfees', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddPractitionerFee(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/practitionerfees/:feeid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { appointmentid } = req.params;
      const apiResults = await DeletePractitionerFee(appointmentid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/practitionerfees/:feeid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { appointmentid } = req.params;
      const apiResults = await UpdatePractitionerFee(req.body, appointmentid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const FeeRoute = route;
export default FeeRoute;
