import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, OneToMany, ManyToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, Timestamp } from 'typeorm';
import { User } from './users.entity.js';
import { Appointment } from './appointment.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { Patient } from './patient.entity.js';
import { Payment } from './payment.entity.js';
import { PractitionerFees } from './practitionerfees.entity.js';
import { Referral } from './referrals.entity.js';
import { Rating } from './rating.entity.js';

@Entity()
export class Practitioner extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerid: string;

   @Column({
      type: 'varchar',
   })
   title: string;

   @Column({
      type: 'varchar',
   })
   department: string;

   @Column({
      type: 'varchar',
   })
   experience: string;

   @CreateDateColumn({
      type: 'timestamp',
   })
   created_at: Timestamp;

   @UpdateDateColumn({
      type: 'timestamp',
   })
   updated_at: Timestamp;

   @OneToOne(() => User)
   @JoinColumn({ name: 'userid', referencedColumnName: 'userid' })
   userId: User;

   @OneToMany(() => Appointment, (appointment) => appointment.Practitioner)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.Practitioner)
   medicalRecord: MedicalRecord[];

   @ManyToMany(() => Patient)
   favoritedByPatients: Patient[];

   @OneToMany(() => Payment, (payment) => payment.patient)
   payments: Payment[];

   @OneToMany(() => PractitionerFees, (fee) => fee.Practitioner)
   fees: PractitionerFees[];

   @OneToMany(() => Referral, (referral) => referral.referringDoctor)
   givenReferrals: Referral[];

   @OneToMany(() => Referral, (referral) => referral.referredDoctor)
   receivedReferrals: Referral[];

   @OneToMany(() => Rating, (rating) => rating.Practitioner)
   ratings: Rating[];
}
