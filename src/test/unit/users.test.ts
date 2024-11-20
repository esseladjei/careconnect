import { AppDataSource } from '@/config/db.js';
import { AddUser } from '@/services/user.service.js';
import { hashPassword, formatResponse } from '@/services/utils.js';
import { Role, UserType } from '@/types/entity.types.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/services/utils.js');

vi.mock('src/config/db.js', () => ({
   AppDataSource: {
      createQueryBuilder: vi.fn(),
   },
}));

describe('User service', () => {
   describe('AddUser', () => {
      const mockUser: UserType = {
         firstname: 'John',
         lastname: 'Doe',
         email: 'johndoe@example.com',
         password: 'password123',
         gender: 'male',
         role: Role.Practitioner,
      };
      const mockInsertResult: InsertResult = {
         identifiers: [{ id: 1 }],
         generatedMaps: [],
         raw: [],
      };

      beforeEach(() => {
         vi.clearAllMocks();
      });
      it('should return a 406 response if user is not provided', async () => {
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: { message: 'NotAcceptable: No user defined', statusCode: 406 },
         });
         const result = await AddUser(null);
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: { message: 'NotAcceptable: No user defined', statusCode: 406 },
         });
      });

      it('should return the inserted user data if user is added successfully', async () => {
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
         const result = await AddUser(mockUser);
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

         await expect(AddUser(mockUser)).rejects.toThrow(errorMessage);
      });
   });
});
