import { Practitioner } from '../entities/practitioner.entity.js';
import { ApiResponse, PractitionerProps, ValidateSignature } from 'src/types/entity.types.js';
import { formatResponse, validatedInputs, hashPassword } from './utils.js';
import { AppDataSource } from 'src/config/db.js';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { Appointment } from 'src/entities/appointment.entity.js';
import { FilteredPractitioners, Locations, PractitionerQuery } from '@/types/practitioner.types.js';

export const AddPractitioner = async (practitioner: PractitionerProps): Promise<ApiResponse.SignatureInsert | ValidateSignature> => {
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
export const GetPractitionerLocations = async (query: string): Promise<ApiResponse.PractitionerLocations> => {
   try {
      const validationResponse = validatedInputs([{ condition: !query, message: `BadRequest: No search query provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const practitionerLocations = await AppDataSource.createQueryBuilder(Practitioner, 'P')
         .select('P.location')
         .distinctOn(['P.location'])
         .orderBy({ 'P.location': 'ASC' })
         .where('P.location Ilike :location', { location: `%${query}%` })
         .getMany();
      if (!practitionerLocations.length) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: query,
            message: `No Practitioner found in this area/location`,
            statusCode: 404,
         });
      }
      return formatResponse<Locations[]>(practitionerLocations);
   } catch (error: any) {
      throw new Error(error);
   }
};
export const GetPractitionersByFilters = async (query: PractitionerQuery): Promise<ApiResponse.PractitionerFilters> => {
   try {
      const { location, experience, specialisations, availability, appointment_type, page = 1, limit = 10 } = query;
      const validationResponse = validatedInputs([{ condition: !query, message: `BadRequest: No search query provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const queryBuilder = await AppDataSource.getRepository(Practitioner).createQueryBuilder('P').leftJoinAndSelect('P.specialisations', 'specialisation').where('1=1');
      queryBuilder.andWhere('P.isActive= :active', { active: 1 });
      if (location) {
         queryBuilder.andWhere('P.location = :location', { location: location });
      }
      if (experience) {
         queryBuilder.andWhere('P.year_of_experience >= :experience', { experience: Number(experience) });
      }

      if (availability) {
         const avail: string[] = availability.split('-');
         queryBuilder.andWhere('P.availability && :availability', { availability: avail });
      }

      if (appointment_type) {
        const appType: string[] = appointment_type.split('-');
         queryBuilder.andWhere('P.appointment_type && :appointment_type', { appointment_type: appType });
      }

      if (specialisations) {
        const spec = specialisations.split(' ');
        //queryBuilder.andWhere('specialisation.name &&  :specialisation', { specialisation: spec });
      }
     //later we add doctor fee
      queryBuilder.select([
         'P.title',
         'P.practitionerId',
         'P.firstname',
         'P.lastname',
         'P.gender',
         'P.location',
         'P.availability',
         'P.appointment_type',
         'P.year_of_experience',
         'specialisation.name',
         'specialisation.years_of_experience',
         'P.profession',
         'P.bio',
         'P.profilePictureUrl',
      ]);
      queryBuilder.take(Number(limit)).skip((Number(page) - 1) * Number(limit));

      const [practitioners, count] = await queryBuilder.getManyAndCount();
      const response = {
         data: practitioners,
         total: count,
         page: Number(page),
         pages: Math.ceil(count / Number(limit)),
      };

      if (!response) {
         return formatResponse<ApiResponse.RecordNotFound>({
            queryIdentifier: undefined,
            message: `No Practitioner found in this area/location`,
            statusCode: 404,
         });
      }
      return formatResponse<FilteredPractitioners>(response);
   } catch (error: any) {
      throw new Error(error);
   }
};
