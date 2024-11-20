import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Practitioner } from './practitioner.entity.js';
import { Patient } from './patient.entity.js';
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

   @OneToOne(() => Practitioner)
   @JoinColumn()
   Practitioner: Practitioner;

   @OneToOne(() => Patient)
   @JoinColumn()
   patient: Patient;
}
