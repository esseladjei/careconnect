import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Practitioner } from '@/entities/practitioner.entity.js';
import { Client } from '@/entities/client.entity.js';
import { Appointment } from '@/entities/appointment.entity.js';

export namespace ApiResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
   }
   type CareConnectArray = Array<  Client  | Practitioner | Appointment>;
   export interface Signature {
      careconnect: RecordNotFound | Client | InsertResult | UpdateResult | DeleteResult | Practitioner | Appointment | CareConnectArray; // Referencing the array type
   }
}

export interface ValidationCondition {
   condition: boolean;
   message: string;
   statusCode: number;
}
