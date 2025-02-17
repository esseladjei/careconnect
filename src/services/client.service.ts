import { DeleteResult, UpdateResult } from 'typeorm';
import { AppDataSource } from '../config/db.js';
import { Appointment } from '../entities/appointment.entity.js';
import { Client } from '../entities/client.entity.js';
import { ApiResponse, ClientProps, ValidateSignature } from '../types/entity.types.js';
import { formatResponse, hashPassword, validatedInputs } from './utils.js';
export const AddClient = async (client: ClientProps): Promise<ApiResponse.SignatureClient | ValidateSignature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !client, message: `BadRequest: Client data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const password = client?.password && (await hashPassword(client.password));

      const clientRepo = AppDataSource.getRepository(Client);
      const newClient = clientRepo.create({
         ...client,
         password,
      });
      const addedClient = await clientRepo.save(newClient);
      return formatResponse<Client>(addedClient);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetClientById = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `BadRequest: No Client ID provided.`, statusCode: 400 }]);
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
      const validationResponse = validatedInputs([{ condition: !userId, message: `BadRequest: No Client User ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const clientAppointments = await AppDataSource.createQueryBuilder(Appointment, 'A')
         .innerJoinAndSelect('A.client', 'client')
         .innerJoinAndSelect('A.practitioner', 'practitioner')
         .where('client.clientId = :id', { id: userId })
         .getMany();
      if (!clientAppointments.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: userId,
            message: `Client Appointment(s) with ID ${userId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Appointment[]>(clientAppointments);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const DeleteClient = async (clientId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientId, message: `NotAcceptable: No Client ID provided.`, statusCode: 406 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Client).where('clientId= :clientid', { clientid: clientId }).execute();
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
      const updatedResults = await AppDataSource.createQueryBuilder().update(Client).set(updateClientData).where('clientId= :clientid', { clientid: clientid }).execute();
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
