import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity.ts';
import { Biodata } from './biodata.entity.ts';
import { Doctor } from './doctor.entity.ts';
import { MedicalRecord } from './medicalrecord.entity.ts';
import { PatientHealthLogs } from './patienthealthlogs.entity.ts';
import { Payment } from './payment.entity.ts';
import { User } from './users.entity.ts';
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
