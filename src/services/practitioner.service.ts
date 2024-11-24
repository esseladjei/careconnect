import { Practitioner } from '../entities/practitioner.entity.js';
import { TypeORMResponse } from 'src/types/entity.types.js';
import { formatResponse } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';

export const AddPractitioner = async (practitioner: Practitioner): Promise<TypeORMResponse.Signature> => {
   try {
      if (!practitioner) return formatResponse<TypeORMResponse.RecordNotFound>({ message: 'NotAcceptable: No Practitioner data defined', statusCode: 406 });
      const addedPractitioner = await AppDataSource.createQueryBuilder().insert().into(Practitioner).values(practitioner).execute();
      return formatResponse<InsertResult>(addedPractitioner);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const getPractitionerById = async (practitionerid: string): Promise<TypeORMResponse.Signature> => {
   try {
      if (!practitionerid) return formatResponse<TypeORMResponse.RecordNotFound>({ message: `NotAcceptable: No practitioner ID: ${practitionerid}`, statusCode: 406 });
      const practitioner = await AppDataSource.createQueryBuilder().select('P').from(Practitioner, 'P').where('P.practitionerid = :id', { id: practitionerid }).getOne();
      if (!practitioner) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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

export const deletePractitioner = async (practitionerid: string): Promise<TypeORMResponse.Signature> => {
   try {
      if (!practitionerid) return formatResponse<TypeORMResponse.RecordNotFound>({ message: `NotAcceptable: No practitioner ID: ${practitionerid}`, statusCode: 406 });
      const deletedResult = await AppDataSource.createQueryBuilder().delete().from(Practitioner).where('practitionerid= :id', { id: practitionerid }).execute();
      if (!deletedResult.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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
export const updatePractitioner = async (updatePractitioner: Practitioner, practitionerid: string): Promise<TypeORMResponse.Signature> => {
   try {
      if (!practitionerid) return formatResponse<TypeORMResponse.RecordNotFound>({ message: `NotAcceptable: No practitioner ID: ${practitionerid}`, statusCode: 406 });
      const updatedResults = await AppDataSource.createQueryBuilder()
         .update(Practitioner)
         .set(updatePractitioner)
         .where('practitionerid= :id', {id: practitionerid })
         .execute();
      if (!updatedResults.affected) {
         return formatResponse<TypeORMResponse.RecordNotFound>({
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
