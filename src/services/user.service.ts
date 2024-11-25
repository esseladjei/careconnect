import { User } from '../entities/users.entity.js';
import { ApiResponse } from 'src/types/entity.types.js';
import { formatResponse, hashPassword, validatedInputs } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddUser = async (user: User): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !user, message: `BadRequest: No User Data provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const password = await hashPassword(user.password);
      const userData = { ...user, password };
      const addedUser = await AppDataSource.createQueryBuilder().insert().into(User).values(userData).execute();
      return formatResponse<InsertResult>(addedUser);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getUserById = async (userId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !userId, message: `BadRequest: No User ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const user = await AppDataSource.createQueryBuilder().select('U').from(User, 'U').where('U.userId = :id', { id: userId }).getOne();
      if (!user) {
         return formatResponse<ApiResponse.RecordNotFound>({
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
export const deleteUser = async (userId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !userId, message: `BadRequest: User ID  is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(User).where('userid= :userid', { userid: userId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
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
export const updateUser = async (updateUserData: User, userId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !userId, message: `BadRequest: No User ID provided.`, statusCode: 400 },
         { condition: !updateUserData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(User).set(updateUserData).where('userid= :userid', { userid: userId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: userId,
            statusCode: 404,
            message: `No record was updated for user: ${userId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
