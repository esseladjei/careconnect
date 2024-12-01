import { Appointment } from '../entities/appointment.entity.js';
import { ApiResponse } from '../types/entity.types.js';
import { formatResponse, validatedInputs } from './utils.js';
import { AppDataSource } from '../config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddAppointment = async (appointmentData: Appointment): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !appointmentData, message: `BadRequest: AppointmentData data is required.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const addedAppointment = await AppDataSource.createQueryBuilder().insert().into(Appointment).values(appointmentData).execute();
      return formatResponse<InsertResult>(addedAppointment);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const DeleteAppointment = async (appointmentId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([{ condition: !appointmentId, message: `NotAcceptable: No Appointment ID provided.`, statusCode: 406 }]);
      if (validationResponse) return validationResponse;
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Appointment).where('appointmentId= :id', { id: appointmentId }).execute();
      if (!deletedResult.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: appointmentId,
            statusCode: 404,
            message: `No Appointment record deleted: ${appointmentId}`,
         });
      }
      return formatResponse<DeleteResult>(deletedResult);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const UpdateAppointment = async (updateAppointmentData: Appointment, appointmentId: string): Promise<ApiResponse.Signature> => {
   try {
      const validationResponse = validatedInputs([
         { condition: !appointmentId, message: `NotAcceptable: No Appointment ID provided.`, statusCode: 406 },
         { condition: !updateAppointmentData, message: `BadRequest: Update  data is required.`, statusCode: 400 },
      ]);
      if (validationResponse) return validationResponse;
      const updatedResults = await AppDataSource.createQueryBuilder().update(Appointment).set(updateAppointmentData).where('appointmentId= :id', { id: appointmentId }).execute();
      if (!updatedResults.affected) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: appointmentId,
            statusCode: 404,
            message: `No Appointment record was updated: ${appointmentId}`,
         });
      }
      return formatResponse<UpdateResult>(updatedResults);
   } catch (error: any) {
      throw new Error(error);
   }
};
