import { ApiResponse, ValidateSignature } from '../types/entity.types.js';
import { PractitionerFees } from '../entities/practitionerfees.entity.js';
import { formatResponse } from './utils.js';
import { InsertResult } from 'typeorm';
import { AppDataSource } from '../config/db.js';
import { validatedInputs } from './utils.js';
export const AddPractitionerFee = async (feeData: PractitionerFees): Promise<ApiResponse.SignatureInsert | ValidateSignature> => {
  try {
      const validationResponse = validatedInputs([{ condition: !feeData, message: `BadRequest: practitioner fee data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
    const addedfee = await AppDataSource.createQueryBuilder().insert().into(PractitionerFees).values(feeData).execute();
      return formatResponse<InsertResult>(addedfee);
   } catch (error: any) {
      throw new Error(error);
   }
};

export const DeletePractitionerFee = async (feeId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !feeId, message: `NotAcceptable: No fee ID provided.`, statusCode: 404 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(PractitionerFees).where('practitionerfeeId= :id', { id: feeId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: feeId,
            statusCode: 404,
            message: `No PractitionerFees record deleted: ${feeId}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdatePractitionerFee = async (updatePractitionerFeesData: PractitionerFees, feeId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !feeId, message: `NotAcceptable: No PractitionerFees ID provided.`, statusCode: 406 },
         { condition: !updatePractitionerFeesData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(PractitionerFees).set(updatePractitionerFeesData).where('practitionerfeeId= :id', { id: feeId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: feeId,
            statusCode: 404,
            message: `No PractitionerFees record was updated: ${feeId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
