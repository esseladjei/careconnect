import { AppDataSource } from '@/config/db.js';
import { User } from '@/entities/users.entity.js';
import { AddUser, deleteUser, getUserById, updateUser } from '@/services/user.service.js';
import { formatResponse, validatedInputs, hashPassword } from '@/services/utils.js';
import { InsertResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiResponse } from '@/types/entity.types.js';
import { UpdateResult } from 'typeorm/browser';
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
         vi.mocked(validatedInputs).mockReturnValue({
            careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
         });
         const result = await AddUser(null);
         expect(formatResponse).toHaveBeenCalled();
         expect(result).toEqual({
            careconnect: {
               careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
            },
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
      const mockNoUserID: ApiResponse.RecordNotFound = { message: 'NotAcceptable: No UserId provided', statusCode: 406 };
      const mockNoUserFound: ApiResponse.RecordNotFound = { message: `User with ID ${userId}  not found`, statusCode: 406 };

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
            careconnect: mockNoUserID,
         });
         const mockQueryBuilder = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            getOne: vi.fn().mockResolvedValue(mockNoUserID),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         const result = await getUserById(null);
         expect(formatResponse).toHaveBeenCalledWith(mockNoUserID);
         expect(result.careconnect).toEqual(mockNoUserID);
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
   describe('Update User', () => {
      const userId: string = 'userId1234';
      const mockNoUserID: ApiResponse.RecordNotFound = { message: 'NotAcceptable: No UserId provided', statusCode: 406 };
      const mockNoUserFound: ApiResponse.RecordNotFound = { message: `User with ID ${userId}  not found`, statusCode: 406 };
      it.only('should update user data when usedid is set', async () => {
         const updateData = { othername: 'updatedname' };
         const updateResponse: UpdateResult = {
            generatedMaps: [],
            raw: [],
            affected: 1,
         };
         vi.mocked(validatedInputs).mockReturnValue({
            careconnect: updateResponse,
         });
         const mockQueryBuilder = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(updateResponse),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

         const result = await updateUser(updateData, 'userid123');
         expect(validatedInputs).toHaveBeenCalled();
         expect(result.careconnect).toEqual(updateResponse);
      });
      it('should not update user when usedid does not exist', async () => {
         const updateData = { othername: 'updatedname' };
         const updateResponse: UpdateResult = {
            generatedMaps: [],
            raw: [],
            affected: 0,
         };
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockNoUserFound,
         });
         const mockQueryBuilder = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(updateResponse),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

         const result = await updateUser(updateData, 'user12345');
         expect(formatResponse).toHaveBeenCalledWith(mockNoUserFound);
         expect(result.careconnect).toEqual(mockNoUserFound);
      });
      it('should not update user when usedid is no provided', async () => {
         const updateData = { othername: 'updatedname' };
         vi.mocked(formatResponse).mockResolvedValue({
            careconnect: mockNoUserID,
         });
         const result = await updateUser(updateData, null);
         expect(formatResponse).toHaveBeenCalledWith(mockNoUserID);
         expect(result.careconnect).toEqual(mockNoUserID);
      });
      it('should throw an exception if error occurs when searching', async () => {
         const errorMessage = 'Database error';
         const updateData = { othername: 'updatedname' };

         const mockQueryBuilder = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockRejectedValue(new Error(errorMessage)),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         await expect(updateUser(updateData, userId)).rejects.toThrow(errorMessage);
      });
   });
   describe('Delete User', () => {
      const userId: string = 'userId1234';
      it('should delete user data when usedid is provided', async () => {
         const deleteResponse: UpdateResult = {
            generatedMaps: [],
            raw: [],
            affected: 1,
         };
         vi.mocked(validatedInputs).mockReturnValue({
            careconnect: deleteResponse,
         });
         const mockQueryBuilder = {
            delete: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(deleteResponse),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         const result = await deleteUser('userid123');
         expect(validatedInputs).toHaveBeenCalled();
         expect(result.careconnect).toEqual(deleteResponse);
      });
      it('should not delete user when usedid does not exist', async () => {
         const deleteResponse: UpdateResult = {
            generatedMaps: [],
            raw: [],
            affected: 0,
         };
         const message = {
            careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
         };
         vi.mocked(validatedInputs).mockReturnValue(message);
         const mockQueryBuilder = {
            delete: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(deleteResponse),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

         const result = await deleteUser('user12345');
         expect(validatedInputs).toHaveBeenCalled();
         expect(result).toEqual(message);
      });
      it('should not delete user when usedid is no provided', async () => {
         const message = {
            careconnect: { message: 'BadRequest: Client data is required.', statusCode: 400 },
         };
         vi.mocked(validatedInputs).mockReturnValue(message);
         const result = await deleteUser(null);
         expect(validatedInputs).toHaveBeenCalled();
         expect(result).toEqual(message);
      });
      it('should throw an exception if error occurs when deleting', async () => {
         const errorMessage = 'Database error';
         const mockQueryBuilder = {
            delete: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            execute: vi.fn().mockRejectedValue(new Error(errorMessage)),
         };
         vi.spyOn(AppDataSource, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
         await expect(deleteUser(userId)).rejects.toThrow(errorMessage);
      });
   });
});
