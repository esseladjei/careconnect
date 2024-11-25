import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity.js';
import { Practitioner } from './practitioner.entity.js';
@Entity()
export class ClientHealthLogs extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   logId: string;

   @Column({
      type: 'varchar',
   })
   symptom_log: string;

   @Column({
      type: 'json',
   })
   vitals_log: JSON;

   @Column({
      type: 'varchar',
   })
   notes: string;

   @ManyToOne(() => Practitioner, (practitioner) => practitioner.practitionerId)
   @JoinColumn({ name: 'practitionerId' })
   practitioner: Practitioner;

   @ManyToOne(() => Client, (client) => client.clientId)
   @JoinColumn({ name: 'clientId' })
   client: Client;
}
