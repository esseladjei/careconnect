import { User } from '../entities/users.entity.js';
import { TypeORMResponse } from 'src/types/entity.types.js';
import { formatResponse, hashPassword } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddUser = async (user: User): Promise<TypeORMResponse.Signature> => {
   try {
      if (!user) return formatResponse<TypeORMResponse.RecordNotFound>({ message: 'NotAcceptable: No user defined', statusCode: 406 });
      const password = await hashPassword(user.password);
      const userData = { ...user, password };
      const addedUser = await AppDataSource.createQueryBuilder().insert().into(User).values(userData).execute();
      return formatResponse<InsertResult>(addedUser);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getUserById = async (userId: string): Promise<TypeORMResponse.Signature> => {
  try {
      if (!userId) return formatResponse<TypeORMResponse.RecordNotFound>({ message: 'NotAcceptable: No UserId provided', statusCode: 406 });
      const user = await AppDataSource.createQueryBuilder().select('U').from(User, 'U').where('U.userId = :id', { id: userId }).getOne();
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
export const updateUser = async (updateUserData: User, userid: string): Promise<TypeORMResponse.Signature> => {
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
