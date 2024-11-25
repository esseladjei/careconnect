import bcrypt from 'bcrypt';
import { Response } from 'express';
import { ApiResponse, ValidationCondition } from 'src/types/entity.types.js';

export const hashPassword = async (password: string): Promise<string> => {
   const salt = await bcrypt.genSalt();
   const hashedPassword = await bcrypt.hash(password, salt);
   return hashedPassword;
};

export const verifyPassword = async (userpassword: string, storedPassword: string): Promise<boolean> => {
   const passwordMatched = await bcrypt.compare(userpassword, storedPassword);
   return passwordMatched;
};

export const formatResponse = <T>(message: T): { careconnect: T } => {
   return {
      careconnect: message,
   };
};

export const sendResponse = <T extends ApiResponse.Signature>(res: Response, apiResults: T) => {
   const { careconnect } = apiResults;
   if ('statusCode' in careconnect) {
      res.status(careconnect.statusCode).json(apiResults);
   } else {
      res.json(apiResults);
   }
};

export const validatedInputs = (conditions: ValidationCondition[]): ApiResponse.Signature | null => {
   for (const { condition, message, statusCode } of conditions) {
      if (condition) {
         return formatResponse({ message, statusCode });
      }
   }
   return null;
};
