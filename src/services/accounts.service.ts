import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db.js';
import { Client } from '../entities/client.entity.js';
import { Practitioner } from '../entities/practitioner.entity.js';
import { ApiResponse, ClientProps, LoginData, PractitionerProps, TokenProp, ValidateSignature } from '../types/entity.types.js';
import { AddClient } from './client.service.js';
import { AddPractitioner } from './practitioner.service.js';
import { formatResponse, verifyPassword } from './utils.js';
const expiresIn = 2;
const isClient = async (accountData: LoginData): Promise<ApiResponse.Signature | string> => {
   try {
      const { email, password } = accountData;
      const loginResponse = await AppDataSource.createQueryBuilder().select('C').from(Client, 'C').where('C.email = :email', { email: email }).getOne();
      if (loginResponse) {
         const isValid = await verifyPassword(password, loginResponse?.password);
         if (isValid) {
            return formatResponse<ClientProps>(loginResponse);
         } else {
            return 'Wrong email and or password';
         }
      }
      return 'No user account found';
   } catch (error: any) {
      throw new Error(error);
   }
};
const isPractitioner = async (accountData: LoginData): Promise<ApiResponse.Signature | string> => {
   try {
      const { email, password } = accountData;
      const loginResponse = await AppDataSource.createQueryBuilder()
         .select('P')
         .from(Practitioner, 'P')
         .where('P.email = :email', { email: email })
         .andWhere('P.password = :password', { password: password })
         .getOne();
      if (loginResponse) {
         const isValid = await verifyPassword(password, loginResponse?.password);
         if (isValid) {
            return formatResponse<PractitionerProps>(loginResponse);
         } else {
            return 'Wrong email and or password';
         }
      }
      return 'No user account found';
   } catch (error: any) {
      throw new Error(error);
   }
};
export const Login = async (accountData: LoginData): Promise<ApiResponse.LoginSignUpResponseSignature> => {
   try {
      const clientdbResponse = await isClient(accountData);
      if (typeof clientdbResponse !== 'string') {
         const { firstname, lastname, email, clientId } = clientdbResponse?.careconnect as ClientProps;
         const payload = {
            id: clientId,
            role: 'clients',
            firstname,
            lastname,
            email,
         };
         const token = generateSignedToken(payload);
         const loggedInClient = formatLoginResponse(token, 'clients', clientId);
         return loggedInClient;
      }

      const practitionerdbResponse = await isPractitioner(accountData);
      if (typeof practitionerdbResponse !== 'string') {
         const { firstname, lastname, email, practitionerId } = practitionerdbResponse?.careconnect as PractitionerProps;
         const payload = {
            id: practitionerId,
            role: 'practitioners',
            firstname,
            lastname,
            email,
         };
         const token = generateSignedToken(payload);
         const loggedInPractitioner = formatLoginResponse(token, 'practitioners', practitionerId);
         return loggedInPractitioner;
      }
      const message = (clientdbResponse || practitionerdbResponse) as string;
      return formatResponse<ApiResponse.RecordNotFound>({
         message: message,
         statusCode: 401,
         queryIdentifier: '',
      });
   } catch (error: any) {
      throw new Error(error);
   }
};

export const SignUp = async (signUpData: ClientProps | PractitionerProps, role: string): Promise<ApiResponse.LoginSignUpResponseSignature | ValidateSignature> => {
   const { firstname, lastname, email } = signUpData;

   if (role === 'client') {
      const client = await AddClient(signUpData as ClientProps);
      const checkValidation = (client as ValidateSignature).careconnect;
      if (checkValidation.statusCode === 400) {
         return client as ValidateSignature;
      }
      const addClientResponse = reformatResponse<ApiResponse.SignatureClient>(client as ApiResponse.SignatureClient);
      const { clientId } = addClientResponse.careconnect;
      const payload = {
         id: clientId,
         role: 'client',
         firstname,
         lastname,
         email,
      };
      const token = generateSignedToken(payload);
      const signedInData = formatLoginResponse(token, 'clients', clientId);
      return signedInData;
   } else {
      const practitioner = await AddPractitioner(signUpData as PractitionerProps);
      const addPractitionerResponse = reformatResponse<ApiResponse.SignaturePractitioner>(practitioner as ApiResponse.SignaturePractitioner);
      const { practitionerId } = addPractitionerResponse.careconnect;
      const payload = {
         id: practitionerId,
         role: 'practitioner',
         firstname,
         lastname,
         email,
      };
      const token = generateSignedToken(payload);
      const signedInData = formatLoginResponse(token, 'practitioners', practitionerId);
      return signedInData;
   }
};

// Generate a token
const generateSignedToken = (payload: TokenProp) => {
   return jwt.sign(payload, process.env.SESSION_SECRET || '', { expiresIn: `${expiresIn}h` });
};

const reformatResponse = <T extends { careconnect: any }>(data: T): T => {
   return { ...data.careconnect };
};
const formatLoginResponse = (token: string, role: string, id: string): ApiResponse.LoginSignUpResponseSignature => {
   return {
      careconnect: {
         id,
         role,
         token,
         expiryTime: expiresIn * 60 * 60, // 2 hours in seconds
      },
   };
};

export const validateSession = (token: string): Promise<any> => {
   return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SESSION_SECRET || '', (err, decoded) => {
         if (err) {
            return reject(new Error('Forbidden: Session expired!'));
         }
         if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
            const user = decoded as TokenProp;
            return resolve(user);
         }
         return reject(new Error('Invalid token payload'));
      });
   });
};
