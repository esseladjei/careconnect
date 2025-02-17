import { Practitioner } from '../entities/practitioner.entity.js';
import { Specialisation } from '../entities/sepcialisation.entity.js';
import { ApiResponse, PractitionerProps, ValidateSignature } from '../types/entity.types.js';
import { formatResponse, validatedInputs, hashPassword } from './utils.js';
import { AppDataSource } from '../config/db.js';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Appointment } from '../entities/appointment.entity.js';
import { FilteredPractitioners, Locations, PractitionerQuery } from '../types/practitioner.types.js';
import { In } from 'typeorm';

export const AddPractitioner = async (practitioner: PractitionerProps): Promise<ApiResponse.SignaturePractitioner | ValidateSignature> => {
   try {
      let specialisations;
      const validationResponse = validatedInputs([
         { condition: !practitioner, message: `BadRequest: Practitioner data is required.`, statusCode: 400 },
         { condition: !practitioner?.specialisationIds || !practitioner?.specialisationIds.length, message: `BadRequest: At least one specialization is required.`, statusCode: 400 },
      ]);

      if (validationResponse) return validationResponse;
      const password = practitioner?.password && (await hashPassword(practitioner.password));
      // Fetch the specialisations by IDs
      if (practitioner.specialisationIds) {
         const specialisationRepo = AppDataSource.getRepository(Specialisation);
         specialisations = await specialisationRepo.findBy({ specialisationId: In(practitioner.specialisationIds) });
         if (specialisations.length === 0) {
            return formatResponse<ApiResponse.RecordNotFound>({
               queryIdentifier: 'specialisations IDs',
               message: 'No specialisation found',
               statusCode: 404,
            });
         }
      }
      // Create the practitioner entity
      const practitionerRepo = AppDataSource.getRepository(Practitioner);
      const newPractitioner = practitionerRepo.create({
         ...practitioner,
         password,
         specialisations, // Associate the specialisations
      });
      // Save the practitioner with relationships
      const addedPractitioner = await practitionerRepo.save(newPractitioner);
      return formatResponse<Practitioner>(addedPractitioner);
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
      const { location, experience, specialisations, availability, appointment_type, fee, page = 1, limit = 10 } = query;
      const validationResponse = validatedInputs([{ condition: !query, message: `BadRequest: No search query provided.`, statusCode: 400 }]);
      if (validationResponse) return validationResponse;
      const queryBuilder = await AppDataSource.getRepository(Practitioner)
         .createQueryBuilder('P')
         .leftJoinAndSelect('P.specialisations', 'specialisation')
         .innerJoinAndSelect('P.fees', 'fees')
         .where('1=1');
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
         const spec: string[] = specialisations.split(',');
         queryBuilder.andWhere('specialisation.specialisationId IN (:...specialisations)', { specialisations: spec });
      }
      if (fee) {
         const [minFee, maxFee] = fee.split('-');
         queryBuilder.andWhere('fees.fee BETWEEN :minFee AND :maxFee', {
            minFee: parseFloat(minFee),
            maxFee: parseFloat(maxFee),
         });
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
         'specialisation.specialisationId',
         'P.profession',
         'P.bio',
         'P.profilePictureUrl',
         'fees.fee',
         'fees.service',
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
            message: `No Practitioner found with selected search parameters`,
            statusCode: 404,
         });
      }
      return formatResponse<FilteredPractitioners>(response);
   } catch (error: any) {
      console.error(error);
      throw new Error(error);
   }
};
