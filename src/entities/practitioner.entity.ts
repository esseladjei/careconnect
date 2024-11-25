import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { Client } from './client.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { Notification } from './notification.entity.js';
import { Payment } from './payment.entity.js';
import { PractitionerFees } from './practitionerfees.entity.js';
import { Rating } from './rating.entity.js';
import { Referral } from './referrals.entity.js';
import { Specialisation } from './sepcialisation.entity.js';

@Entity()
export class Practitioner extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerId: string;

   @Column({
      type: 'varchar',
   })
   title: string;
   @Column({
      type: 'varchar',
   })
   firstname: string;

   @Column({
      type: 'varchar',
   })
   lastname: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   othername: string;

   @Column({
      type: 'varchar',
   })
   email: string;

   @Column({
      type: 'date',
      nullable: true,
   })
   dateofbirth: Date;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   gender: string;

   @Column({
      type: 'varchar',
      default: 'active',
   })
   isActive: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   telephonenumber: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   address: string;
   @Column({
      type: 'varchar',
   })
   password: string;
   @Column({
     type: 'varchar',
     nullable:true,
   })
   profession: string;
   @Column({
      type: 'varchar',
      nullable: true,
   })
   profilePictureUrl: string;

   @Column({
      type: 'varchar',
   })
   department: string;

   @Column({
      type: 'varchar',
   })
   @Column({ type: 'text', nullable: true })
   bio: string;

   experience: string;

   @CreateDateColumn({
      type: 'timestamp',
   })
   created_at: Timestamp;

   @UpdateDateColumn({
      type: 'timestamp',
   })
   updated_at: Timestamp;

   @OneToMany(() => Appointment, (appointment) => appointment.practitioner)
   @JoinColumn({ name: 'appointmentId' })
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.practitioner)
   @JoinColumn({ name: 'medicalRecordId' })
   medicalRecords: MedicalRecord[];

   @ManyToMany(() => Client)
   favoritedByClients: Client[];

   @OneToMany(() => Payment, (payment) => payment.client)
   @JoinColumn({ name: 'paymentId' })
   payments: Payment[];

   @OneToMany(() => PractitionerFees, (fee) => fee.Practitioner)
   @JoinColumn({ name: 'feeId' })
   fees: PractitionerFees[];

   @OneToMany(() => Referral, (referral) => referral.referringDoctor)
   @JoinColumn({ name: 'givenReferrals', referencedColumnName: 'referralId' })
   givenReferrals: Referral[];

   @OneToMany(() => Referral, (referral) => referral.referredDoctor)
   @JoinColumn({ name: 'receivedReferrals', referencedColumnName: 'referralId' })
   receivedReferrals: Referral[];

   @OneToMany(() => Rating, (rating) => rating.Practitioner)
   @JoinColumn({ name: 'ratingId' })
   ratings: Rating[];

   @ManyToMany(() => Specialisation, (specialisation) => specialisation.practitioners, { cascade: true })
   @JoinTable({ name: 'practitioner_specialisations' }) // This decorator defines the join table for the many-to-many relationship
   specialisations: Specialisation[];

   @ManyToMany(() => Client, (client) => client.favoritePractitioners)
   @JoinTable({ name: 'favoritePractitioner' })
   clients: Client[];

   @OneToMany(() => Practitioner, (practitioner) => practitioner.notifications)
   @JoinColumn({ name: 'notificationId' })
   notifications: Notification[];
}
