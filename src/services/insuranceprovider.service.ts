import { ApiResponse } from 'src/types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { InsuranceProvider as Provider } from '@/entities/insuranceproviders.entity.js';
export const AddProvider = async (provider: Provider): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !provider, message: `BadRequest: Insurance provider data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedProvider = await AppDataSource.createQueryBuilder().insert().into(Provider).values(provider).execute();
      return formatResponse<InsertResult>(addedProvider);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetAllProviders = async (): Promise<ApiResponse.Signature> => {
   try {
      const provider = await AppDataSource.createQueryBuilder().select('P').from(Provider, 'P').getMany();
      if (!provider.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: undefined,
            message: `No insurance prodiver(s) not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Provider[]>(provider);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetProviderById = async (providerId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !providerId, message: `BadRequest: No provider ID.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const provider = await AppDataSource.createQueryBuilder().select('I').from(Provider, 'I').where('I.providerId = :id', { id: providerId }).getOne();
      if (!provider) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: providerId,
            message: `Insurance provider with ID ${providerId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Provider>(provider);
   } catch (error: any) {
      throw new Error(error);
   }
};

export const DeleteProvider = async (providerid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !providerid, message: `BadRequest: No Insurance Provider ID available.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Provider).where('providerId= :id', { id: providerid }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: providerid,
            statusCode: 404,
            message: `No insurance provider record was deleted: ${providerid}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdateProvider = async (updateProviderData: Provider, providerId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !providerId, message: `BadRequest: No Client ID provided.`, statusCode: 400 },
         { condition: !updateProviderData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(Provider).set(updateProviderData).where('providerId= :id', { id: providerId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: providerId,
            statusCode: 404,
            message: `No record was updated for client: ${providerId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
