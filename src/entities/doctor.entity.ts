import {
   Entity,
   PrimaryGeneratedColumn,
   OneToOne,
   JoinColumn,
   Column,
   OneToMany,
   ManyToMany,
} from 'typeorm';
import { Biodata } from './biodata.entity.ts';
import { User } from './users.entity.ts';
import { Appointment } from './appointment.entity.ts';
import { MedicalRecord } from './medicalrecord.entity.ts';
import { Patient } from './patient.entity.ts';
import { Payment } from './payment.entity.ts';
import { DoctorFees } from './doctorfees.entity.ts';
import { Referral } from './referrals.entity.ts';
import { Rating } from './rating.entity.ts';

@Entity()
export class Doctor extends Biodata {
   @PrimaryGeneratedColumn('uuid')
   doctorid!: number;

   @Column({
      type: 'varchar',
   })
   experience: string;

   @OneToOne(() => User)
   @JoinColumn()
   user: User;

   @OneToMany(() => Appointment, (appointment) => appointment.doctor)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.doctor)
   medicalRecord: MedicalRecord[];

   @ManyToMany(() => Patient)
   favoritedByPatients: Patient[];

   @OneToMany(() => Payment, (payment) => payment.patient)
   payments: Payment[];

   @OneToMany(() => DoctorFees, (fee) => fee.doctor)
   fees: DoctorFees[];

   @OneToMany(() => Referral, (referral) => referral.referringDoctor)
   givenReferrals: Referral[];

   @OneToMany(() => Referral, (referral) => referral.referredDoctor)
   receivedReferrals: Referral[];

   @OneToMany(() => Rating, (rating) => rating.doctor)
   ratings: Rating[];
}
