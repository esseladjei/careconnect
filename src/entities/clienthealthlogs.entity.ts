import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Client } from './client.entity.js';

@Entity()
export class ClientHealthLogs extends BaseEntity {
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

   @ManyToOne(() => Client, (client) => client.healthLogs)
   client: Client;
}
