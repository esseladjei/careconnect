import { AppDataSource } from '@/config/db.js';
import { AddClient } from '@/services/client.service.js';
import { formatResponse } from '@/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Client } from '@/entities/client.entity.js';

// Mock dependencies
vi.mock('@/services/utils.js');

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
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: { message: 'NotAcceptable: No client defined', statusCode: 406 },
         });
         const result = await AddClient(null);
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: { message: 'NotAcceptable: No client defined', statusCode: 406 },
         });
      });

      it('should return the inserted client data if client is added successfully', async () => {
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
