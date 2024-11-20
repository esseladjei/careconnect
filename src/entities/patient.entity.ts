import { Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { Biodata } from './biodata.entity.js';
import { Doctor } from './doctor.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { PatientHealthLogs } from './patienthealthlogs.entity.js';
import { Payment } from './payment.entity.js';
import { User } from './users.entity.js';
@Entity()
export class Patient extends Biodata {
   @PrimaryGeneratedColumn('uuid')
   patientid!: number;

   @OneToOne(() => User)
   @JoinColumn()
   user: User;

   @OneToMany(() => Appointment, (appointment) => appointment.patient)
   appointments: Appointment[];

   @OneToMany(() => MedicalRecord, (record) => record.patient)
   medicalRecord: MedicalRecord[];

   @ManyToMany(() => Doctor)
   @JoinTable()
   favoriteDoctors: Doctor[];

   @OneToMany(() => Payment, (payment) => payment.patient)
   payments: Payment[];

   @OneToMany(() => PatientHealthLogs, (log) => log.patient)
   healthLogs: PatientHealthLogs[];
}
