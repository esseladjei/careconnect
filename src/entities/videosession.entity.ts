import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToOne,
   JoinColumn,
   BaseEntity,
} from 'typeorm';
import { Doctor } from './doctor.entity.ts';
import { Patient } from './patient.entity.ts';
import { Timestamp } from 'typeorm/browser';

@Entity()
export class VideoSession extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   sessionId!: number;

   @Column({
      type: 'varchar',
   })
   session_link: string;
   @Column({
      type: 'varchar',
   })
   recording_url: string;

   @Column({
      type: 'timestamp',
   })
   start_time: Timestamp;

   @Column({
      type: 'timestamp',
   })
   end_time: Timestamp;

   @OneToOne(() => Doctor)
   @JoinColumn()
   doctor: Doctor;

   @OneToOne(() => Patient)
   @JoinColumn()
   patient: Patient;
}
