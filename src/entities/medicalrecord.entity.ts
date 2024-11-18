import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   ManyToOne,
   BaseEntity,
   OneToMany,
} from 'typeorm';
import { Patient } from './patient.entity.ts';
import { Doctor } from './doctor.entity.ts';
import { Appointment } from './appointment.entity.ts';
import { Prescription } from './prescriptions.entity.ts';

@Entity()
export class MedicalRecord extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   medicalrecordsId!: number;

   @Column({
      type: 'date',
   })
   record_date: Date;

   @Column({
      type: 'varchar',
   })
   notes: string;

   @OneToOne(() => Appointment)
   appointment: Appointment;

   @ManyToOne(() => Doctor, (doctor) => doctor.medicalRecord)
   doctor: Doctor;

   @ManyToOne(() => Patient, (patient) => patient.medicalRecord)
   patient: Patient;

   @OneToMany(() => Prescription, (prescription) => prescription.medicalRecord)
   prescriptions: Prescription[];
}
