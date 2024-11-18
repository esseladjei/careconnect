import express, { Request, Response, NextFunction } from 'express';
import { AddUser, getUserById, updateUser, deleteUser } from 'src/services/user.service.ts';
import { sendResponse } from 'src/services/utils.ts';
const route = express.Router();

route.post('/users', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const apiResults = await AddUser(req.body);
       sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.get('/users/:userid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userid } = req.params;
      const apiResults = await getUserById(userid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.delete('/users/:userid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      const apiResults = await deleteUser(id);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
route.put('/users/:userid', async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { userid } = req.params;
      const apiResults = await updateUser(req.body, userid);
      sendResponse(res, apiResults);
   } catch (error) {
      next(error);
   }
});
export { route as UserRoute };
