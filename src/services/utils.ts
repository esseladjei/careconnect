import bcrypt from 'bcrypt';
import { Response } from 'express';
import { TypeORMResponse } from 'src/types/entity.types.js';

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

export const sendResponse = <T extends TypeORMResponse.Signature>(res: Response, apiResults: T) => {
   const { careconnect } = apiResults;
   if ('statusCode' in careconnect) {
      res.status(careconnect.statusCode).json(apiResults);
   } else {
      res.json(apiResults);
   }
};
