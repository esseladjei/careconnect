import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity.js';
import { Practitioner } from './practitioner.entity.js';
import { MedicalRecord } from './medicalrecord.entity.js';
import { VideoSession } from './videosession.entity.js';
@Entity()
export class Appointment extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   appointmentId: string;

   @Column({
      type: 'timestamp',
   })
   appointment_datetime: Date;

   @Column({
      type: 'int',
      default: 1,
   })
   status: number;

   @Column({
      type: 'varchar',
   })
   reason: string;

   @Column({
      type: 'varchar',
      nullable: true,
   })
   specialnote: string;

   @ManyToOne(() => Client, (client) => client.clientId)
   @JoinColumn({ name: 'clientId' })
   client: Client;

   @ManyToOne(() => Practitioner, (Practitioner) => Practitioner.practitionerId)
   @JoinColumn({ name: 'practitionerId' })
   practitioner: Practitioner;

   @OneToOne(() => MedicalRecord)
   @JoinColumn({ name: 'medicalrecordId', referencedColumnName: 'medicalrecordId' })
   medicalRecord: MedicalRecord;

   @OneToOne(() => VideoSession)
   @JoinColumn({ name: 'sessionId', referencedColumnName: 'sessionId' })
   session: VideoSession;

}
