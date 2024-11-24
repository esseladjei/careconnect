import { Client } from '@/entities/client.entity.js';
import { ApiResponse } from 'src/types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { Appointment } from '@/entities/appointment.entity.js';
export const AddClient = async (client: Client): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !client, message: `BadRequest: Client data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedClient = await AppDataSource.createQueryBuilder().insert().into(Client).values(client).execute();
      return formatResponse<InsertResult>(addedClient);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetClientById = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `NotAcceptable: No Client ID provided.`, statusCode: 406 }]);
      if (validationResponse) return validationResponse;
      const client = await AppDataSource.createQueryBuilder().select('C').from(Client, 'C').where('C.clientId = :id', { id: clientId }).getOne();
      if (!client) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: clientId,
            message: `Client with ID ${clientId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Client>(client);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetClientAppointmentsById = async (userId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !userId, message: `NotAcceptable: No Client User ID provided.`, statusCode: 406 }]);
      if (validationResponse) return validationResponse;
     const clientAppointments = await AppDataSource.createQueryBuilder(Appointment, 'A')
        .innerJoinAndSelect('A.client', 'client')
        .innerJoinAndSelect('A.practitioner', 'practitioner')
        .where('client.userId = :id', { id: userId })
        .getMany();
      if (!clientAppointments.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: userId,
            message: `Client Appointment(s) with ID ${userId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Appointment>(clientAppointments);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const DeleteClient = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `NotAcceptable: No Client ID provided.`, statusCode: 406 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Client).where('clientid= :clientid', { clientid: clientId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: clientId,
            statusCode: 404,
            message: `No record was deleted for client: ${clientId}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdateClient = async (updateClientData: Client, clientid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !clientid, message: `NotAcceptable: No Client ID provided.`, statusCode: 406 },
         { condition: !updateClientData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(Client).set(updateClientData).where('clientid= :clientid', { clientid: clientid }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: clientid,
            statusCode: 404,
            message: `No record was updated for client: ${clientid}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
