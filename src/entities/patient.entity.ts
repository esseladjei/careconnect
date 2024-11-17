import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   OneToMany,
   JoinTable,
   ManyToMany,
} from 'typeorm';
import { Biodata } from './biodata.entity.ts';
import { User } from './users.entity.ts';
import { Doctor } from './doctor.entity.ts';
import { Appointment } from './appointment.entity.ts';
import { MedicalRecord } from './medicalrecord.entity.ts';
import { Payment } from './payment.entity.ts';
import { PatientHealthLogs } from './patienthealthlogs.entity.ts';
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
