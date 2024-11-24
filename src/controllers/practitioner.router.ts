import { AddPractitioner, deletePractitioner, getPractitionerById, updatePractitioner } from '@/services/practitioner.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from 'src/services/utils.js';
const route = express.Router();

route.post('/practitioners', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddPractitioner(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await getPractitionerById(practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await deletePractitioner(practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/practitioners/:practitionerid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { practitionerid } = req.params;
      const apiResults = await updatePractitioner(req.body, practitionerid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const PractitionerRoute = route;
export default PractitionerRoute;
