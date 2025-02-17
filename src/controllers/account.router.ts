import express, { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../services/utils.js';
import { Login, SignUp, validateSession } from '../services/accounts.service.js';
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
route.get('/validate-session', async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers['authorization'];
   const token = (authHeader && authHeader.split(' ')[1]) || '';
   try {
      const validate = await validateSession(token);
      res.status(200).json(validate);
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
});

const AccountsRoute = route;
export default AccountsRoute;
