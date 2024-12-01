import { AddInsurance, DeleteInsurance, GetInsuranceById, UpdateInsurance } from '../services/insurance.service.js';
import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
import { SearchParams } from '../types/entity.types.js';
const route = express.Router();

route.post('/insurances', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddInsurance(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/insurances/:searchkey', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { searchkey } = req.params;
      const searchByClientID: SearchParams = { clientId: searchkey };
      const searchByInsuranceID: SearchParams = { insuranceId: searchkey };
      const apiResults = await GetInsuranceById(searchByClientID || searchByInsuranceID);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/insurances/:insuranceid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { insuranceid } = req.params;
      const apiResults = await DeleteInsurance(insuranceid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/insurances/:insuranceid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { insuranceid } = req.params;
      const apiResults = await UpdateInsurance(req.body, insuranceid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const InsuranceRoute = route;
export default InsuranceRoute;
