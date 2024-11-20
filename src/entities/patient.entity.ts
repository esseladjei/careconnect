import { BaseEntity, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { Practitioner } from './practitioner.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { PatientHealthLogs } from './patienthealthlogs.entity.js';
import { Payment } from './payment.entity.js';
import { User } from './users.entity.js';
@Entity()
export class Patient extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   patientid: string;

   @OneToOne(() => User)
   @JoinColumn({ name: 'userid', referencedColumnName: 'userid' })
   user: User;

   @OneToMany(() => Appointment, (appointment) => appointment.patient)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.patient)
   medicalRecord: MedicalRecord[];

   @ManyToMany(() => Practitioner)
   @JoinTable()
   favoriteDoctors: Practitioner[];

   @OneToMany(() => Payment, (payment) => payment.patient)
   payments: Payment[];

   @OneToMany(() => PatientHealthLogs, (log) => log.patient)
   healthLogs: PatientHealthLogs[];
}
