import { AppDataSource } from '@/config/db.js';
import { AddPractitioner } from '@/services/practitioner.service.js';
import { formatResponse, validatedInputs } from '@/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Practitioner } from '@/entities/practitioner.entity.js';

// Mock dependencies
vi.mock('@/services/utils.js');

vi.mock('src/config/db.js', () => ({
   AppDataSource: {
      createQueryBuilder: vi.fn(),
   },
}));

describe('Practitioner service', () => {
   describe('AddPractitioner', () => {
      const mockUser: Practitioner = {
         profession: 'Teacher',
         bio: 'A primary school teacher',
         userId: 'userid1234',
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
         (AppDataSource.createQueryBuilder as any).mockReturnValue({
            insert: () => ({
               into: () => ({
                  values: () => ({
                     execute: vi.fn().mockResolvedValue(mockInsertResult),
                  }),
               }),
            }),
         });
         const result = await AddPractitioner(mockUser);
         expect(validatedInputs).toHaveBeenCalled();
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({ careconnect: mockInsertResult });
      });

      it('should throw an error if an exception occurs during insertion', async () => {
         const errorMessage = 'Database error';
         (AppDataSource.createQueryBuilder as any).mockReturnValue({
            insert: () => ({
               into: () => ({
                  values: () => ({
                     execute: vi.fn().mockRejectedValue(new Error(errorMessage)),
                  }),
               }),
            }),
         });

         await expect(AddPractitioner(mockUser)).rejects.toThrow(errorMessage);
      });
   });
});
