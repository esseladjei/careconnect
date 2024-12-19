import { PractitionerProps } from '@/types/entity.types.js';
import { AppDataSource } from 'src/config/db.js';
import { AddPractitioner } from 'src/services/practitioner.service.js';
import { formatResponse, hashPassword, validatedInputs } from 'src/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('src/services/utils.js');

vi.mock('src/config/db.js', () => ({
   AppDataSource: {
      createQueryBuilder: vi.fn(),
      getRepository: vi.fn(),
   },
}));

describe('Practitioner service', () => {
   describe('AddPractitioner', () => {
      const mockUser: PractitionerProps = {
        profession: 'Teacher',
        bio: 'A primary school teacher',
        email: 'johndoe@example.com',
        password: 'password123',
        specialisationIds: [1, 2],
        practitionerId: '',
        firstname: '',
        lastname: ''
      };
      const mockInsertResult: InsertResult = {
         identifiers: [{ id: 1 }],
         generatedMaps: [],
         raw: [],
      };

      beforeEach(() => {
         vi.clearAllMocks();
      });
      it('should return a 400 response if user is not provided', async () => {
         vi.mocked(validatedInputs).mockReturnValue({
            careconnect: { message: 'BadRequest: No User Data provided.', statusCode: 400 },
         });
         const result = await AddPractitioner(null);
         expect(validatedInputs).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: { message: 'BadRequest: No User Data provided.', statusCode: 400 },
         });
      });

      it('should return the inserted user data if user is added successfully', async () => {
         vi.mocked(validatedInputs).mockReturnValue(null);
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockInsertResult,
         });
        (AppDataSource.getRepository as any).mockReturnValue({
            findBy:vi.fn().mockResolvedValue([{specialisationId: 1, name:'general doctor'}, {specialisationId: 2, name:'dentist'}]),
            create: vi.fn().mockReturnValue(mockUser),
            save: vi.fn().mockResolvedValue(mockInsertResult),
         });
         const result = await AddPractitioner(mockUser);
         expect(hashPassword).toHaveBeenCalledWith(mockUser.password);
         expect(validatedInputs).toHaveBeenCalled();
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({ careconnect: mockInsertResult });
      });

      it('should throw an error if an exception occurs during insertion', async () => {
         const errorMessage = 'Database error';
        (AppDataSource.getRepository as any).mockReturnValue({
           findBy: vi.fn().mockResolvedValue([
              { specialisationId: 1, name: 'general doctor' },
              { specialisationId: 2, name: 'dentist' },
           ]),
           create: vi.fn().mockReturnValue(mockUser),
           save: vi.fn().mockRejectedValue(new Error(errorMessage)),
        });

         await expect(AddPractitioner(mockUser)).rejects.toThrow(errorMessage);
      });
   });
});
