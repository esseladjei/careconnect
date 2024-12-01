import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Appointment } from '../entities/appointment.entity.js';
import { ClientHealthLogs } from '../entities/clienthealthlogs.entity.js';
import { Insurance } from '../entities/insurance.entity.js';
import { InsuranceProvider } from '../entities/insuranceproviders.entity.js';
export namespace ApiResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
      token?: string;
   }
   type CareConnectArray = Array<ClientProps | PractitionerProps | Appointment | ClientHealthLogs | InsuranceProvider>;

   export interface Signature {
      careconnect: RecordNotFound | ClientProps | InsertResult | UpdateResult | DeleteResult | PractitionerProps | Appointment | ClientHealthLogs | Insurance | InsuranceProvider | CareConnectArray; // Referencing the array type
   }

   export interface WrongPassword {
      statusCode: 406;
      message: string;
      email: string;
   }
}
export interface ClientProps {
   clientId?: string;
   firstname: string;
   lastname: string;
   othername?: string;
   email: string;
   password?: string;
   dateofbirth?: Date;
   gender?: string;
   isActive?: number;
   phonenumber?: string;
   address?: string;
   profilePictureUrl?: string;
   profession?: string;
   bio?: string;
  token?: string;
  accountOption?:string
}
export interface PractitionerProps {
   practitionerId?: string;
   firstname: string;
   lastname: string;
   othername?: string;
   email: string;
   password?: string;
   dateofbirth?: Date;
   gender?: string;
   isActive?: number;
   phonenumber?: string;
   address?: string;
   profilePictureUrl?: string;
   profession?: string;
   bio?: string;
   token?: string;
   accountOption?: string;
}
export type SearchParams = { clientId: string; insuranceId?: never } | { insuranceId: string; clientId?: never };

export interface ValidationCondition {
   condition: boolean;
   message: string;
   statusCode: number;
}

export interface LoginData {
   email: string;
   password: string;
}
export type SignUpData = (ClientProps & { accountOption?: string }) | (PractitionerProps & { accountOption?: string });

export interface SignUpResponse {
   identifiers: Array<string>;
   generatedMaps: Array<PractitionerProps> | Array<ClientProps>;
   raw: [PractitionerProps] | [ClientProps];
}
