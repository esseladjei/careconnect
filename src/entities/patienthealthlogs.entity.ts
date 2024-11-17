import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   BaseEntity,
   ManyToOne,
} from 'typeorm';

import { Patient } from './patient.entity.ts';

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
