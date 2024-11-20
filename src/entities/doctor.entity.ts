import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Biodata } from './biodata.entity.js';
import { User } from './users.entity.js';
import { Appointment } from './appointment.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { Patient } from './patient.entity.js';
import { Payment } from './payment.entity.js';
import { DoctorFees } from './doctorfees.entity.js';
import { Referral } from './referrals.entity.js';
import { Rating } from './rating.entity.js';

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
