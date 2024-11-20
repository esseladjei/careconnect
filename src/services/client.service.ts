import { Client } from '@/entities/client.entity.js';
import { TypeORMResponse } from 'src/types/entity.types.js';
import { formatResponse } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddClient = async (client: Client): Promise<TypeORMResponse.Signature> => {
   try {
      if (!client) return formatResponse<TypeORMResponse.RecordNotFound>({ message: 'NotAcceptable: No client defined', statusCode: 406 });
      const addedClient = await AppDataSource.createQueryBuilder().insert().into(Client).values(client).execute();
      return formatResponse<InsertResult>(addedClient);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getClientById = async (clientId: string): Promise<TypeORMResponse.Signature> => {
  try {
      const client = await AppDataSource.createQueryBuilder().select('P').from(Client, 'C').where('C.clientId = :id', { id: clientId }).getOne();
    if (!client) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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
/* Late we will think about if we need all clients*/
export const deleteClient = async (clientId: string): Promise<TypeORMResponse.Signature> => {
   try {
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Client).where('clientid= :clientid', { clientid: clientId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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
export const updateClient = async (updateClientData: Client, clientid: string): Promise<TypeORMResponse.Signature> => {
   try {
      const updatedResults = await AppDataSource.createQueryBuilder().update(Client).set(updateClientData).where('clientid= :clientid', { clientid: clientid }).execute();
      if (!updatedResults.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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
