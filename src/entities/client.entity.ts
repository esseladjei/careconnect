import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { ClientHealthLogs } from './clienthealthlogs.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { Payment } from './payment.entity.js';
import { Practitioner } from './practitioner.entity.js';
@Entity()
export class Client extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   clientId: string;

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
      type: 'int',
      default: 1,
   })
   isActive: number;

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
      nullable: true,
   })
   profilePictureUrl: string;
  
   @Column({  type: 'varchar', nullable: true })
   profession: string;

   @Column({  type: 'varchar', nullable: true })
   bio: string;

   @CreateDateColumn({
      type: 'timestamp',
   })
   created_at: Timestamp;

   @UpdateDateColumn({
      type: 'timestamp',
   })
   updated_at: Timestamp;

   @OneToMany(() => Appointment, (appointment) => appointment.client)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.client)
   @JoinColumn({ name: 'medicalRecordId' })
   medicalRecords: MedicalRecord[];

   @ManyToMany(() => Practitioner, (practitioner) => practitioner.clients)
   @JoinTable({ name: 'favoritePractitioner' })
   favoritePractitioners: Practitioner[];

   @OneToMany(() => Payment, (payment) => payment.client)
   payments: Payment[];

   @OneToMany(() => ClientHealthLogs, (log) => log.client)
   healthLogs: ClientHealthLogs[];
}
