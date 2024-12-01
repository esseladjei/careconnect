import { Practitioner } from '../entities/practitioner.entity.js';
import { ApiResponse, PractitionerProps } from '../types/entity.types.js';
import { formatResponse, validatedInputs, hashPassword } from './utils.js';
import { AppDataSource } from '../config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { Appointment } from '../entities/appointment.entity.js';

export const AddPractitioner = async (practitioner: PractitionerProps): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !practitioner, message: `BadRequest: Practitioner data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const password = practitioner?.password && (await hashPassword(practitioner.password));
      const practitionerData = { ...practitioner, password };
      const addedPractitioner = await AppDataSource.createQueryBuilder().insert().into(Practitioner).values(practitionerData).execute();
      return formatResponse<InsertResult>(addedPractitioner);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getPractitionerById = async (practitionerid: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !practitionerid, message: `BadRequest: No Practitioner ID provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const practitioner = await AppDataSource.createQueryBuilder().select('P').from(Practitioner, 'P').where('P.practitionerId = :id', { id: practitionerid }).getOne();
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
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Practitioner).where('practitionerId= :id', { id: practitionerid }).execute();
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
      const updatedResults = await AppDataSource.createQueryBuilder().update(Practitioner).set(updatePractitioner).where('practitionerId= :id', { id: practitionerid }).execute();
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
      const practitionerAppointments = await AppDataSource.createQueryBuilder(Appointment, 'A')
         .innerJoinAndSelect('A.practitioner', 'practitioner')
         .innerJoinAndSelect('A.client', 'client')
         .where('practitioner.practitionerId = :id', { id: userId })
         .getMany();
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
