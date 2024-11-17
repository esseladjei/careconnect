import express, { Request, Response } from 'express';
import { AddUser } from 'src/services/user.service.ts';

const route = express.Router();

route.post('/user', async (req: Request, res: Response) => {
   const user = await AddUser(req.body);
   res.json(user);
});

export { route as UserRoute };
