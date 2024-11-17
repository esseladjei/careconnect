import { User } from '../entities/users.entity.ts';
import { UserType } from 'src/types/entity.types.ts';
import { hashPassword } from './utils.ts';
export const AddUser = async (user: UserType): Promise<User> => {
   const addedUser = await User.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: await hashPassword(user.password),
      role: user.role,
      gender: user.gender,
   }).save();
   return addedUser;
};
