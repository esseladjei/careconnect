import express, { Request, Response } from 'express';
import { User } from '../entities/Users.js';
const route = express.Router();

route.get('/user', async (req: Request, res: Response) => {
   const user = User.create({
      name: 'test',
      email: 'test',
   });
   await user.save();
   res.json(user);
});

export { route as UserRoute };
