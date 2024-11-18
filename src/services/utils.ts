import bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from 'src/entities/users.entity.ts';
import { TypeORMResponse } from 'src/types/entity.types.ts';

export const hashPassword = async (password: string): Promise<string> => {
   const salt = await bcrypt.genSalt();
   const hashedPassword = await bcrypt.hash(password, salt);
   return hashedPassword;
};

export const verifyPassword = async (userpassword: string, storedPassword: string): Promise<boolean> => {
   const passwordMatched = await bcrypt.compare(userpassword, storedPassword);
   return passwordMatched;
};

export const notFoundResponse = (message: TypeORMResponse.RecordNotFound): TypeORMResponse.Signature => {
   return {
      careconnect: message,
   };
};

export const sendResponse = <T extends TypeORMResponse.ApiResult>(res: Response<any, Record<string, any>>, apiResults: T) => {
   if ('careconnect' in apiResults) {
      const { careconnect } = apiResults as TypeORMResponse.Signature;
      res.status(careconnect?.statusCode).json(apiResults.careconnect);
   } else {
      res.json(apiResults);
   }
};
