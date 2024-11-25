import { ApiResponse, SearchParams } from 'src/types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { Insurance } from '@/entities/insurance.entity.js';
export const AddInsurance = async (clientInsurance: Insurance): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !clientInsurance, message: `BadRequest: Client insurance data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedClient = await AppDataSource.createQueryBuilder().insert().into(Insurance).values(clientInsurance).execute();
      return formatResponse<InsertResult>(addedClient);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetInsuranceById=  async (SearchParams: SearchParams ): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !SearchParams.clientId || !SearchParams.insuranceId, message: `BadRequest: No Client/Insurance ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const client = await AppDataSource.createQueryBuilder().select('I').from(Insurance, 'I').where('I.insuranceid = :id', { id: SearchParams }).getOne();
      if (!client) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: SearchParams.clientId,
            message: `Client with ID ${SearchParams.clientId || SearchParams.insuranceId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Insurance>(client);
   } catch (error: any) {
      throw new Error(error);
   }
};

export const DeleteInsurance = async (insuranceid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !insuranceid, message: `BadRequest: No Client ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Insurance).where('insuranceId= :id', { id: insuranceid }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: insuranceid,
            statusCode: 404,
            message: `No insurance record was deleted for client: ${insuranceid}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdateInsurance = async (updateClientInsuranceData: Insurance, insuranceId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !insuranceId, message: `BadRequest: No Client ID provided.`, statusCode: 400 },
         { condition: !updateClientInsuranceData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(Insurance).set(updateClientInsuranceData).where('insuranceId= :id', { id: insuranceId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: insuranceId,
            statusCode: 404,
            message: `No record was updated for client: ${insuranceId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
