import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { Client } from './client.entity.js';
import { Practitioner } from './practitioner.entity.js';
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

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.medicalRecord)
   Practitioner: Practitioner;

   @ManyToOne(() => Client, (client) => client.medicalRecord)
   client: Client;

   @OneToMany(() => Prescription, (prescription) => prescription.medicalRecord)
   prescriptions: Prescription[];
}
