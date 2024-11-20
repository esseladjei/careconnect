import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, Decimal128 } from 'typeorm';
import { Client } from './client.entity.js';
import { Appointment } from './appointment.entity.js';
const enum PaymentStatus {
   PENDING = 'pending',
   PAID = 'paid',
}
@Entity()
export class Payment extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   paymentId!: number;

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
   appointment: Appointment;

   @ManyToOne(() => Client, (client) => client.payments)
   client: Client;
}
