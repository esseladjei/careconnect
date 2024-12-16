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
import { ClientHealthLogs } from './clienthealthlogs.entity.js';
@Entity()
export class Practitioner extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   practitionerId: string;

   @Column({
      type: 'varchar',
      nullable: true,
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
      unique: true,
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
      type: 'int',
      default: 1,
   })
   isActive: number;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   phonenumber: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   location: string;

   @Column({
      type: 'varchar',
      array: true,
      nullable: true,
      default: ['telephone', 'video', 'private_clinic'],
   })
   availability: Array<string>;

   @Column({
      type: 'varchar',
      array: true,
      nullable: true,
      default: ['flexible', 'sameday'],
   })
   appointment_type: Array<string>;

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
      type: 'int',
      default: 1,
   })
   termsandconditions: string;

   @Column({
      type: 'int',
      default: 0,
   })
   appUpdatesConsent: number;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   profession: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   profilePictureUrl: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   department: string;

   @Column({ type: 'text', nullable: true })
   bio: string;

   @Column({
      type: 'int',
      default: 1,
      nullable: true,
   })
   year_of_experience: number;

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
   @JoinTable({ name: 'practitioner_specialisations' })
   specialisations: Specialisation[];

   @ManyToMany(() => Client, (client) => client.favoritePractitioners)
   @JoinTable({ name: 'favoritePractitioner' })
   clients: Client[];

   @OneToMany(() => Practitioner, (practitioner) => practitioner.notifications)
   @JoinColumn({ name: 'notificationId' })
   notifications: Notification[];

   @OneToMany(() => ClientHealthLogs, (log) => log.practitioner)
   healthLogs: ClientHealthLogs[];
}
