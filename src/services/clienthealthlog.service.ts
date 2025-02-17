import { ClientHealthLogs } from '../entities/clienthealthlogs.entity.js';
import { ApiResponse } from '../types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from '../config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddHealthLog = async (healthLogData: ClientHealthLogs): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !healthLogData, message: `BadRequest: HealthLogData data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedHealthLog = await AppDataSource.createQueryBuilder().insert().into(ClientHealthLogs).values(healthLogData).execute();
      return formatResponse<InsertResult>(addedHealthLog);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetHealthLogById = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `BadRequest: No Client ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const healthlog = await AppDataSource.createQueryBuilder(ClientHealthLogs, 'Logs').innerJoinAndSelect('Logs.client', 'client').where('client.clientId = :id', { id: clientId }).getOne();
      if (!healthlog) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: clientId,
            message: `Client with ID ${clientId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<ClientHealthLogs>(healthlog);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetHealthLogsById = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `BadRequest: No Client ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const client = await AppDataSource.createQueryBuilder(ClientHealthLogs, 'Logs').innerJoinAndSelect('Logs.client', 'client').where('client.clientId = :id', { id: clientId }).getMany();
      if (!client) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: clientId,
            message: `Client with ID ${clientId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<ClientHealthLogs[]>(client);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const DeleteHealthLog = async (logId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !logId, message: `BadRequest: No HealthLog ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(ClientHealthLogs).where('logId= :id', { id: logId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: logId,
            statusCode: 404,
            message: `No HealthLog record deleted: ${logId}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdateHealthLog = async (updateHealthLogData: ClientHealthLogs, logId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !logId, message: `BadRequest: No HealthLog ID provided.`, statusCode: 400 },
         { condition: !updateHealthLogData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(ClientHealthLogs).set(updateHealthLogData).where('logId= :id', { id: logId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: logId,
            statusCode: 404,
            message: `No HealthLog record was updated: ${logId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
