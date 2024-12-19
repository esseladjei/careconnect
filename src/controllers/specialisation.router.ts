import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
import { AddSpecialisation, getAllSpecialisations } from '../services/specialisation.service.js';
const route = express.Router();

route.post('/specialisations', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddSpecialisation(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});

route.get('/specialisations', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await getAllSpecialisations();
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});

const SpecialisationRoute = route;
export default SpecialisationRoute;
