import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Appointment } from '../entities/appointment.entity.js';
import { ClientHealthLogs } from '../entities/clienthealthlogs.entity.js';
import { Insurance } from '../entities/insurance.entity.js';
import { InsuranceProvider } from '../entities/insuranceproviders.entity.js';
import { FilteredPractitioners, Locations } from './practitioner.types.js';
import { Specialisation } from '@/entities/sepcialisation.entity.js';
import { Practitioner } from '@/entities/practitioner.entity.js';
export namespace ApiResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
      token?: string;
   }
   export interface LoginResponse {
      token: string;
      role: string;
      id: string;
   }
   export interface WrongPassword {
      statusCode: 406;
      message: string;
      email: string;
   }
   type CareConnectArray = Array<ClientProps | PractitionerProps | Appointment | ClientHealthLogs | InsuranceProvider | Specialisation>;

   export interface Signature {
      careconnect:
         | RecordNotFound
         | ClientProps
         | InsertResult
         | UpdateResult
         | DeleteResult
         | PractitionerProps
         | Appointment
         | ClientHealthLogs
         | Insurance
         | InsuranceProvider
         | CareConnectArray; // Referencing the array type
   }
  export interface SignaturePractitioner {
     careconnect: Practitioner;
  }
   export interface SignatureInsert {
      careconnect: InsertResult;
   }
   export interface SignatureUpdate extends RecordNotFound {
      careconnect: UpdateResult;
   }
   export interface SignatureDelete extends RecordNotFound {
      careconnect: DeleteResult;
   }
   export interface LoginSignUpResponseSignature {
      careconnect: LoginResponse | RecordNotFound;
   }
   export interface PractitionerLocations {
      careconnect: RecordNotFound | Locations[];
   }
   export interface PractitionerFilters {
      careconnect: RecordNotFound | FilteredPractitioners;
   }
}
export interface ClientProps {
   clientId: string;
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
export interface PractitionerProps {
   practitionerId: string;
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
   specialisationIds: number[];
}
export type SearchParams = { clientId: string; insuranceId?: never } | { insuranceId: string; clientId?: never };

export interface ValidateSignature {
   careconnect: {
      message: string;
      statusCode: number;
   };
}
export interface ValidationCondition {
   condition: boolean;
   message: string;
   statusCode: number;
}

export interface LoginData {
   email: string;
   password: string;
}

export interface TokenProp {
   id: string;
   role: string;
   firstname: string;
   lastname: string;
   email: string;
}
