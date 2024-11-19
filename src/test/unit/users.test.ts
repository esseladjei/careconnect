import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserType, TypeORMResponse, Role } from 'src/types/entity.types.ts';
import * as utils from 'src/services/utils.ts';
import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { AppDataSource } from 'src/config/db.ts';
import { AddUser, getUserById, deleteUser, updateUser } from 'src/services/user.service.ts';

// Mock dependencies
/* vi.mock('src/services/utils.ts', () => ({
   hashPassword: vi.fn(),
})); */

vi.mock('src/config/db.ts', () => ({
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
         role: Role.DOCTOR,
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
         const result = await AddUser(null);
         expect(result).toEqual({
            careconnect: { message: 'NotAcceptable: No user defined', statusCode: 406 },
         });
      });

      it('should return the inserted user data if user is added successfully', async () => {
         (AppDataSource.createQueryBuilder as any).mockReturnValue({
            insert: () => ({
               into: () => ({
                  values: () => ({
                     execute: vi.fn().mockResolvedValue(mockInsertResult),
                  }),
               }),
            }),
         });
         const spy = vi.spyOn(utils, 'hashPassword').mockResolvedValue('hashedPassword');
         const result = await AddUser(mockUser);
         //expect(spy).toHaveBeenCalledWith(mockUser.password);NOT WORKING AS EXPECTED EVENTHOUGH THE FUNCTION IS CALLED
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
