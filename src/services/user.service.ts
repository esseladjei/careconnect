import { User } from '../entities/users.entity.ts';
import { TypeORMResponse, UserType } from 'src/types/entity.types.ts';
import { hashPassword, notFoundResponse } from './utils.ts';
import { AppDataSource } from 'src/config/db.ts';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { InsertResult } from 'typeorm/browser';
export const AddUser = async (user: UserType): Promise<TypeORMResponse.Signature | InsertResult> => {
   try {
      if (!user) return notFoundResponse({ message: 'NotAcceptable: No user defined', statusCode: 406 });
      const password = await hashPassword(user.password);
      const userData = { ...user, password };
      const addedUser = await AppDataSource.createQueryBuilder().insert().into(User).values(userData).execute();
      return addedUser;
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getUserById = async (userId: string): Promise<TypeORMResponse.Signature | User> => {
   try {
      const user = await User.findOneBy({ userid: userId });
      if (!user) {
         return notFoundResponse({
            queryIdentifier: userId,
            message: `User with ID ${userId} not found`,
            statusCode: 404,
         });
      }
      return user;
   } catch (error: any) {
      throw new Error(error);
   }
};
/* Late we will think about if we need all users*/
export const deleteUser = async (userId: string): Promise<TypeORMResponse.Signature | DeleteResult> => {
   try {
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(User).where('userid= :userid', { userid: userId }).execute();
      if (!deletedResult.affected) {
         return notFoundResponse({
            queryIdentifier: userId,
            statusCode: 404,
            message: `No record was deleted for user: ${userId}`,
         });
      }
      return deletedResult;
   } catch (error: any) {
      throw new Error(error);
   }
};
export const updateUser = async (updateUserData: UserType, userid: string): Promise<TypeORMResponse.Signature | UpdateResult> => {
   try {
      const updatedResults = await AppDataSource.createQueryBuilder().update(User).set(updateUserData).where('userid= :userid', { userid: userid }).execute();
      if (!updatedResults.affected) {
         return notFoundResponse({
            queryIdentifier: userid,
            statusCode: 404,
            message: `No record was updated for user: ${userid}`,
         });
      }
      return updatedResults;
   } catch (error: any) {
      throw new Error(error);
   }
};
