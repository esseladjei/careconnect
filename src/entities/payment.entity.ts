import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, Decimal128, JoinColumn, Relation } from 'typeorm';
import { Client } from './client.entity.js';
import { Appointment } from './appointment.entity.js';
const enum PaymentStatus {
   PENDING = 'pending',
   PAID = 'paid',
}
@Entity()
export class Payment extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   paymentId: string;

   @Column({
      type: 'varchar',
   })
   status: PaymentStatus;

   @Column({
      type: 'timestamp',
   })
   payment_date: Date;

   @Column({
      type: 'decimal',
   })
   amount: Decimal128;

   @OneToOne(() => Appointment)
   appointment:Relation< Appointment>;

   @ManyToOne(() => Client, (client) => client.payments)
   @JoinColumn({ name: 'clientId' })
   client:Relation< Client>;
}
