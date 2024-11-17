import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   BaseEntity,
   ManyToOne,
   OneToOne,
   Decimal128,
} from 'typeorm';
import { Patient } from './patient.entity.ts';
import { Appointment } from './appointment.entity.ts';
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

   @ManyToOne(() => Patient, (patient) => patient.payments)
   patient: Patient;
}
