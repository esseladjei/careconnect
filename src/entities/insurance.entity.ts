import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Client } from './client.entity.js';
import {InsuranceProvider} from './insuranceproviders.entity.js'
@Entity()
export class Insurance extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   insuranceId: string;

   @Column({
      type: 'varchar',
   })
   policynumber: string;

   @Column({
      type: 'varchar',
   })
   coverage_details: string;

   @Column({
      type: 'varchar',
   })
   contact_info: string;

   @OneToOne(() => InsuranceProvider)
   @JoinColumn({ name: 'providerId' })
   InsuranceProvider: InsuranceProvider;

   @OneToOne(() => Client)
   @JoinColumn({ name: 'clientId' })
   client: Client;
}
