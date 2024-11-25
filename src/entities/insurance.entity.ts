import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Client } from './client.entity.js';

@Entity()
export class Insurance extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   insuranceId: string;

   @Column({
      type: 'varchar',
   })
   providername: string;

   @Column({
      type: 'varchar',
   })
   policynumber: string;

   @Column({
      type: 'varchar',
   })
   coveragedetails: string;

   @Column({
      type: 'varchar',
   })
   contactinfo: string;

   @OneToOne(() => Client)
   @JoinColumn({ name: 'clientId' })
   client: Client;
}
