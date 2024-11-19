import { User } from '../entities/users.entity.ts';
import { TypeORMResponse, UserType } from 'src/types/entity.types.ts';
import { formatResponse, hashPassword } from './utils.ts';
import { AppDataSource } from 'src/config/db.ts';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { InsertResult } from 'typeorm/browser';
export const AddUser = async (user: UserType): Promise<TypeORMResponse.Signature> => {
   try {
      if (!user) return formatResponse<TypeORMResponse.RecordNotFound>({ message: 'NotAcceptable: No user defined', statusCode: 406 });
      const password = await hashPassword(user.password);
      const userData = { ...user, password };
      const addedUser = await AppDataSource.createQueryBuilder().insert().into(User).values(userData).execute();
      return formatResponse<InsertResult>(addedUser);
   } catch (error:any) {
      throw new Error(error);
   }
};
export const getUserById = async (userId: string): Promise<TypeORMResponse.Signature> => {
   try {
      const user = await User.findOneBy({ userid: userId });
      if (!user) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
            queryIdentifier: userId,
            message: `User with ID ${userId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<User>(user);
   } catch (error: any) {
      throw new Error(error);
   }
};
/* Late we will think about if we need all users*/
export const deleteUser = async (userId: string): Promise<TypeORMResponse.Signature> => {
   try {
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(User).where('userid= :userid', { userid: userId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
            queryIdentifier: userId,
            statusCode: 404,
            message: `No record was deleted for user: ${userId}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const updateUser = async (updateUserData: UserType, userid: string): Promise<TypeORMResponse.Signature> => {
   try {
      const updatedResults = await AppDataSource.createQueryBuilder().update(User).set(updateUserData).where('userid= :userid', { userid: userid }).execute();
      if (!updatedResults.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
            queryIdentifier: userid,
            statusCode: 404,
            message: `No record was updated for user: ${userid}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
