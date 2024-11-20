import { AppDataSource } from '@/config/db.js';
import { AddUser } from '@/services/user.service.js';
import { hashPassword, formatResponse } from '@/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '@/entities/users.entity.js';
import { getUserById } from '@/services/user.service.js';
import { TypeORMResponse } from '@/types/entity.types.js';
// Mock dependencies
vi.mock('@/services/utils.js');

vi.mock('src/config/db.js', () => ({
   AppDataSource: {
      createQueryBuilder: vi.fn(),
   },
}));

describe('User service', () => {
   describe('AddUser', () => {
      const mockUser: User = {
         firstname: 'John',
         lastname: 'Doe',
         email: 'johndoe@example.com',
         password: 'password123',
         gender: 'male',
         role: 'Doctor',
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
   describe('Get User', () => {
      const mockUser: User = {
         userid: '3f2b161e-cb4b-4a68-a0c2-d0047c247eef',
         firstname: 'John',
         lastname: 'Doe',
         othername: '',
      };
      const userId: string = 'userId1234';
      const mockNotFound: TypeORMResponse.RecordNotFound = { message: 'NotAcceptable: No UserId provided', statusCode: 406 };
      const mockNoUserFound: TypeORMResponse.RecordNotFound = { message: `User with ID ${userId}  not found`, statusCode: 406 };

      it('should return user when usedid is set', async () => {
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockUser,
         });
         const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getOne: vi.fn().mockResolvedValue(mockUser),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         const result = await getUserById('client123');
         expect(formatResponse).toHaveBeenCalledWith(mockUser);
         expect(result.careconnect).toEqual(mockUser);
      });
      it('should not return user when no usedid is set', async () => {
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockNotFound,
         });
         const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getOne: vi.fn().mockResolvedValue(mockNotFound),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         const result = await getUserById(null);
         expect(formatResponse).toHaveBeenCalledWith(mockNotFound);
         expect(result.careconnect).toEqual(mockNotFound);
      });
      it('should not return user found when userid does not exist', async () => {
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockNoUserFound,
         });
         const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getOne: vi.fn().mockResolvedValue(mockNoUserFound),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         const result = await getUserById(userId);
         expect(formatResponse).toHaveBeenCalledWith(mockNoUserFound);
         expect(result.careconnect).toEqual(mockNoUserFound);
      });
      it('should throw an exception if error occurs when searching', async () => {
         const errorMessage = 'Database error';
         const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getOne: vi.fn().mockRejectedValue(new Error(errorMessage)),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         await expect(getUserById(userId)).rejects.toThrow(errorMessage);
      });
   });
});
