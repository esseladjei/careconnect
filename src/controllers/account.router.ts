import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
import { Login, SignUp } from '../services/accounts.service.js';
import { ApiResponse } from '../types/entity.types.js';
const route = express.Router();

route.post('/login', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await Login(req.body);
      sendResponse<ApiResponse.LoginSignUpResponseSignature>(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { accountOption } = req.body;
      delete req.body?.accountOption;
      const apiResults = await SignUp(req.body, accountOption);
      sendResponse<ApiResponse.LoginSignUpResponseSignature>(res, apiResults);
   } catch (error) {
      next(error);
   }
});
const AccountsRoute = route;
export default AccountsRoute;
