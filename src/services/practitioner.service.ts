import { Practitioner } from '../entities/practitioner.entity.js';
import { ApiResponse } from 'src/types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { Appointment } from '@/entities/appointment.entity.js';

export const AddPractitioner = async (practitioner: Practitioner): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !practitioner, message: `BadRequest: Practitioner data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedPractitioner = await AppDataSource.createQueryBuilder().insert().into(Practitioner).values(practitioner).execute(); 
     return formatResponse<InsertResult>(addedPractitioner);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getPractitionerById = async (practitionerid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !practitionerid, message: `BadRequest: No Practitioner ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const practitioner = await AppDataSource.createQueryBuilder().select('P').from(Practitioner, 'P').where('P.practitionerid = :id', { id: practitionerid }).getOne();
      if (!practitioner) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: practitionerid,
            message: `Practitioner with ID ${practitionerid} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Practitioner>(practitioner);
   } catch (error: any) {
      throw new Error(error);
   }
};

export const deletePractitioner = async (practitionerid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !practitionerid, message: `BadRequest: No Practitioner ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Practitioner).where('practitionerid= :id', { id: practitionerid }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: practitionerid,
            statusCode: 404,
            message: `No record was deleted for Practitioner: ${practitionerid}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const updatePractitioner = async (updatePractitioner: Practitioner, practitionerid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !practitionerid, message: `BadRequest: No Practitioner ID provided.`, statusCode: 400 },
         { condition: !updatePractitioner, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(Practitioner).set(updatePractitioner).where('practitionerid= :id', { id: practitionerid }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: practitionerid,
            statusCode: 404,
            message: `No record was updated for Practitioner: ${practitionerid}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetPractitionerAppointmentsById = async (userId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !userId, message: `BadRequest: No Practitioner User ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const practitionerAppointments = await AppDataSource.createQueryBuilder(Appointment, 'A').innerJoinAndSelect('A.practitioner', 'practitioner').where('practitioner.userId = :id', { id: userId }).getMany();
      if (!practitionerAppointments.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: userId,
            message: `Practitioner appointment(s) with ID ${userId} not found`,
            statusCode: 404,
         });
      }
      return formatResponse<Appointment[]>(practitionerAppointments);
   } catch (error: any) {
      throw new Error(error);
   }
};