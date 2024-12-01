import { AppDataSource } from '../config/db.js';
import { ApiResponse, LoginData, SignUpData, SignUpResponse } from '../types/entity.types.js';
import { Practitioner } from '../entities/practitioner.entity.js';
import { Client } from '../entities/client.entity.js';
import { formatResponse, verifyPassword } from './utils.js';
import { AddClient } from './client.service.js';
import { AddPractitioner } from './practitioner.service.js';
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { ClientProps, PractitionerProps } from '../types/entity.types.js';
import { Appointment } from '@/entities/appointment.entity.js';
import { ClientHealthLogs } from '@/entities/clienthealthlogs.entity.js';
import { Insurance } from '@/entities/insurance.entity.js';
import { InsuranceProvider } from '@/entities/insuranceproviders.entity.js';
import { InsertResult, UpdateResult, DeleteResult } from 'typeorm';
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey).toString();

const isClient = async (accountData: LoginData): Promise<ApiResponse.Signature> => {
   try {
      const { email, password } = accountData;
      const loginResponse = await AppDataSource.createQueryBuilder().select('C').from(Client, 'C').where('C.email = :email', { email: email }).getOne();
      if (loginResponse) {
         const isValid = await verifyPassword(password, loginResponse?.password);
         if (isValid) {
            return formatResponse<ClientProps>(loginResponse);
         } else {
            return formatResponse<ApiResponse.WrongPassword>({
               message: 'Wrong password',
               statusCode: 406,
               email: email,
            });
         }
      }
      return formatResponse<ApiResponse.RecordNotFound>({
         queryIdentifier: email,
         message: `Login failed: No client account found with email ${email}`,
         statusCode: 404,
      });
   } catch (error: any) {
      throw new Error(error);
   }
};
const isPractitioner = async (accountData: LoginData): Promise<ApiResponse.Signature> => {
   try {
      const { email, password } = accountData;
      const loginResponse = await AppDataSource.createQueryBuilder()
         .select('P')
         .from(Practitioner, 'C')
         .where('P.email = :email', { email: email })
         .andWhere('P.password = :password', { password: password })
         .getOne();
      if (loginResponse) {
         const isValid = await verifyPassword(password, loginResponse?.password);
         if (isValid) {
            return formatResponse<PractitionerProps>(loginResponse);
         } else {
            return formatResponse<ApiResponse.WrongPassword>({
               message: 'Wrong password',
               statusCode: 406,
               email: email,
            });
         }
      }
      return formatResponse<ApiResponse.RecordNotFound>({
         queryIdentifier: email,
         message: `Login failed: No practitioner account found with email ${email}`,
         statusCode: 404,
      });
   } catch (error: any) {
      throw new Error(error);
   }
};
export const Login = async (accountData: LoginData): Promise<ApiResponse.Signature> => {
   try {
      // Check if the account is a client
      const client = await isClient(accountData);
      if ('token' in client.careconnect) {
         const token = generateToken(client.careconnect as ClientProps);
         client.careconnect.token = token;
         return client;
      }
      // If not a client, check if it's a practitioner
      const practitioner = await isPractitioner(accountData);
      if ('token' in practitioner.careconnect) {
         const token = generateToken(practitioner.careconnect as PractitionerProps);
         practitioner.careconnect.token = token;
         return practitioner;
      }
      return formatResponse<ApiResponse.RecordNotFound>({
         message: 'No User account exist',
         statusCode: 404,
         queryIdentifier: '',
      });
   } catch (error: any) {
      throw new Error(error);
   }
};

export const SignUp = async (signUpData: SignUpData): Promise<ApiResponse.Signature> => {
   if (signUpData.accountOption === 'client') {
      delete signUpData?.accountOption;
      const client = await AddClient(signUpData);
      const token = generateToken(client.careconnect as ClientProps);
      return reformatResponse(client.careconnect as SignUpResponse, token, 'clients');
   } else {
      const practitioner = await AddPractitioner(signUpData);
      const token = generateToken(practitioner.careconnect as PractitionerProps);
      return reformatResponse(practitioner.careconnect as SignUpResponse, token, 'practitioners');
   }
};

// Generate a token
const generateToken = (user: ClientProps & PractitionerProps) => {
   return jwt.sign({ userId: user?.clientId || user?.practitionerId }, encodedKey, { expiresIn: '1h' });
};

// Verify a token in a protected route
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   try {
      if (token) {
         const decoded = jwt.verify(token, encodedKey);
         (req as any).user = decoded;
      }
      next();
   } catch (error: any) {
      res.status(401).send(`Unauthorized: ${error}`);
   }
};

const reformatResponse = (data: SignUpResponse, token: string, accountOption: string): ApiResponse.Signature => {
   return { careconnect: { ...data?.generatedMaps[0], token, accountOption } };
};
