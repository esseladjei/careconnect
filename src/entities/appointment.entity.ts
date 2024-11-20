import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, Timestamp, OneToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity.js';
import { Doctor } from './doctor.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { VideoSession } from './videosession.entity.js';
@Entity()
export class Appointment extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   appointmentId!: number;

   @Column({
      type: 'varchar',
   })
   appointment_type: string;

   @Column({
      type: 'time',
   })
   appointment_time: Timestamp;

   @Column({
      type: 'date',
   })
   appointment_date: Date;

   @Column({
      type: 'varchar',
      default: 'active',
   })
   status: string;

   @Column({
      type: 'varchar',
   })
   reason_for_visit: string;

   @ManyToOne(() => Patient, (patient) => patient.appointments)
   patient: Patient;

   @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
   doctor: Doctor;

   @OneToOne(() => MedicalRecord)
   @JoinColumn()
   medicalRecord: MedicalRecord;

   @OneToOne(() => VideoSession)
   @JoinColumn()
   videoSession: VideoSession;
}
