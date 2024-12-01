import { AppDataSource } from src/config/db.js';
import { AddClient } from src/services/client.service.js';
import { formatResponse, validatedInputs, hashPassword } from src/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Client } from src/entities/client.entity.js';

// Mock dependencies
vi.mock(src/services/utils.js');

vi.mock('src/config/db.js', () => ({
   AppDataSource: {
      createQueryBuilder: vi.fn(),
   },
}));

describe('Client service', () => {
   describe('AddClient', () => {
      const mockUser: Client = {
         profession: 'Teacher',
         bio: 'A primary school teacher',
      };
      const mockInsertResult: InsertResult = {
         identifiers: [{ id: 1 }],
         generatedMaps: [],
         raw: [],
      };

      beforeEach(() => {
         vi.clearAllMocks();
      });
      it('should return a 406 response if client is not provided', async () => {
         vi.mocked(validatedInputs).mockReturnValue({
            careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
         });
         const result = await AddClient(null);
         expect(validatedInputs).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
         });
      });

      it('should return the inserted client data if client is added successfully', async () => {
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
         const result = await AddClient(mockUser);
        expect(validatedInputs).toHaveBeenCalled();
              expect(hashPassword).toHaveBeenCalledWith(mockUser.password);
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: mockInsertResult,
         });
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

         await expect(AddClient(mockUser)).rejects.toThrow(errorMessage);
      });
   });
});
