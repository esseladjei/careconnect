import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

export enum Role {
   DOCTOR = 'doctor',
   PATIENT = 'patient',
}
export interface UserType {
   firstname: string;
   lastname: string;
   othername: string;
   email: string;
   dateofbirth: Date;
   gender: string;
   isActive: string;
   telephonenumber: string;
   address: string;
   profilePictureUrl: string;
   role: Role;
   password: string;
}

export namespace TypeORMResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
   }
   export interface Signature {
      careconnect: RecordNotFound | UserType | InsertResult | UpdateResult | DeleteResult ;
   }
}
