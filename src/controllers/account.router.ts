import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
import { Login, SignUp } from '../services/accounts.service.js';
const route = express.Router();

route.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
      const apiResults = await Login(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   } 
});
route.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
   try {
     const apiResults = await SignUp(req.body);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const AccountsRoute = route;
export default AccountsRoute;
