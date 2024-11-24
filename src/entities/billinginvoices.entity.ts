import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity, Decimal128 } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';
import { Client } from './client.entity.js';

@Entity()
export class BillingInvoice extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   invoiceId!: number;

   @Column({
      type: 'date',
   })
   date_issued: Date;

   @Column({
      type: 'date',
   })
   date_due: Date;

   @Column({
      type: 'varchar',
   })
   status: string;

   @Column({
      type: 'decimal',
   })
   amount: Decimal128;

   @OneToOne(() => Practitioner)
   @JoinColumn()
   Practitioner: Practitioner;

   @OneToOne(() => Client)
   @JoinColumn()
   client: Client;
}
