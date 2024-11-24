import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { Client } from './client.entity.js';
import { Practitioner } from './practitioner.entity.js';
import { Prescription } from './prescriptions.entity.js';

@Entity()
export class MedicalRecord extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   medicalrecordId: string;

   @Column({
      type: 'date',
   })
   record_date: Date;

   @Column({
      type: 'varchar',
   })
   notes: string;

   @OneToOne(() => Appointment)
   @JoinColumn({ name: 'appointmentId' })
   appointment: Appointment;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.medicalRecords)
   @JoinColumn({ name: 'practitionerId' })
   practitioner: Practitioner;

   @ManyToOne(() => Client, (client) => client.medicalRecords)
   @JoinColumn({ name: 'clientId' })
   client: Client;

   @OneToMany(() => Prescription, (prescription) => prescription.medicalRecords)
   @JoinColumn({ name: 'prescriptionId' })
   prescriptions: Prescription[];
}
