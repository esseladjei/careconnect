import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Practitioner } from '@/entities/practitioner.entity.js';
import { User } from '@/entities/users.entity.js';
import { Client } from '@/entities/client.entity.js';

export namespace TypeORMResponse {
   export interface RecordNotFound {
      statusCode: number | 404;
      message: string;
      queryIdentifier?: string;
   }
   export interface Signature {
      careconnect: RecordNotFound | User | Client | InsertResult | UpdateResult | DeleteResult | Practitioner;
   }
}
