import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { Patient } from './patient.entity.js';
import { Doctor } from './doctor.entity.js';
import { Appointment } from './appointment.entity.js';
import { Prescription } from './prescriptions.entity.js';

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
