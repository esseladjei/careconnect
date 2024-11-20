import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Practitioner } from '@/entities/practitioner.entity.js';
import { User } from '@/entities/users.entity.js';
export enum Role {
   DOCTOR = 'doctor',
   PATIENT = 'patient',
}
export namespace TypeORMResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
   }
   export interface Signature {
      careconnect: RecordNotFound | User | InsertResult | UpdateResult | DeleteResult | Practitioner;
   }
}
