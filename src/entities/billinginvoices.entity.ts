import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   BaseEntity,
   Decimal128,
} from 'typeorm';
import { Doctor } from './doctor.entity.ts';
import { Patient } from './patient.entity.ts';

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

   @OneToOne(() => Doctor)
   @JoinColumn()
   doctor: Doctor;

   @OneToOne(() => Patient)
   @JoinColumn()
   patient: Patient;
}
