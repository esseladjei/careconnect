import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Patient } from './patient.entity.js';

@Entity()
export class PatientHealthLogs extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   logId!: number;

   @Column({
      type: 'varchar',
   })
   symptom_log: string;

   @Column({
      type: 'varchar',
   })
   vitals_log: string;

   @Column({
      type: 'varchar',
   })
   notes: string;

   @ManyToOne(() => Patient, (patient) => patient.healthLogs)
   patient: Patient;
}
