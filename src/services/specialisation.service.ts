import { ApiResponse, ValidateSignature } from '../types/entity.types.js';
import { Specialisation } from '../entities/sepcialisation.entity.js';
import { formatResponse } from './utils.js';
import { InsertResult } from 'typeorm';
import { AppDataSource } from '../config/db.js';
import { validatedInputs } from './utils.js';
export const AddSpecialisation = async (specialisationData: Specialisation): Promise<ApiResponse.SignatureInsert | ValidateSignature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !specialisationData, message: `BadRequest: specialisation data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedSpecialisation = await AppDataSource.createQueryBuilder().insert().into(Specialisation).values(specialisationData).execute();
      return formatResponse<InsertResult>(addedSpecialisation);
   } catch (error: any) {
      throw new Error(error);
   }
};

export const getAllSpecialisations = async (): Promise<ApiResponse.Signature> => {
   try {
      const specialisations = await AppDataSource.createQueryBuilder().select('S').from(Specialisation, 'S').getMany();
      if (!specialisations.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: 'No specialisations',
            message: `No specialisations stored`,
            statusCode: 404,
         });
      }
      return formatResponse<Specialisation[]>(specialisations);
   } catch (error: any) {
      throw new Error(error);
   }
};
